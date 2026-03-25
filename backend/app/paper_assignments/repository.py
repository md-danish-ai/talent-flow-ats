from datetime import date
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session, aliased

from app.classifications.models import Classification
from app.papers.models import Paper
from app.papers.repository import get_paper
from app.questions import repository as question_repository
from app.users.models import User
from app.utils.status_codes import StatusCode

from .models import PaperAssignment
from .schemas import PaperAssignmentCreate


def _build_assignment_query(db: Session):
    assigned_by_user = aliased(User)
    return (
        db.query(
            PaperAssignment,
            User.username.label("username"),
            Paper.paper_name.label("paper_name"),
            assigned_by_user.username.label("assigned_by_name"),
        )
        .join(User, PaperAssignment.user_id == User.id)
        .join(Paper, PaperAssignment.paper_id == Paper.id)
        .outerjoin(assigned_by_user, PaperAssignment.assigned_by == assigned_by_user.id)
    )


def _hydrate_assignment_result(result):
    if not result:
        return None

    assignment, username, paper_name, assigned_by_name = result
    assignment.username = username
    assignment.paper_name = paper_name
    assignment.assigned_by_name = assigned_by_name
    return assignment


def _extract_question_ids(question_payload: Any) -> list[int]:
    ids: list[int] = []

    def walk(value: Any) -> None:
        if isinstance(value, int):
            ids.append(value)
            return

        if isinstance(value, str):
            stripped = value.strip()
            if stripped.isdigit():
                ids.append(int(stripped))
            return

        if isinstance(value, list):
            for item in value:
                walk(item)
            return

        if isinstance(value, dict):
            for item in value.values():
                walk(item)

    walk(question_payload)
    return list(dict.fromkeys(ids))


def _resolve_question_type(question: dict) -> str:
    type_code = ((question.get("question_type") or {}).get("code") or "").upper()
    if type_code in {"IMAGE_MULTIPLE_CHOICE", "IMAGE_MCQ"}:
        return "IMAGE_MCQ"
    if type_code in {"IMAGE_SUBJECTIVE", "IMAGE_DESCRIPTIVE", "IMAGE_WRITTEN"}:
        return "IMAGE_SUBJECTIVE"
    if type_code in {"PASSAGE_MULTIPLE_CHOICE", "PASSAGE_MCQ"}:
        return "PASSAGE_MCQ"
    if type_code == "SUBJECTIVE":
        return "SUBJECTIVE"
    if type_code == "MULTIPLE_CHOICE":
        return "MCQ"
    if type_code == "TYPING_TEST":
        return "TYPING_TEST"
    if type_code == "LEAD_GENERATION":
        return "LEAD_GENERATION"
    if type_code == "CONTACT_DETAILS":
        return "CONTACT_DETAILS"

    # Fallback heuristics
    if question.get("passage"):
        return "PASSAGE_MCQ"
    if question.get("image_url"):
        # If it has image but NO options, it's likely an image-based subjective
        if question.get("options"):
            return "IMAGE_MCQ"
        return "IMAGE_SUBJECTIVE"
    if question.get("options"):
        return "MCQ"
    return "SUBJECTIVE"


def _sanitize_options(raw_options: Any) -> list[str]:
    if not isinstance(raw_options, list):
        return []

    options: list[str] = []
    for option in raw_options:
        if isinstance(option, dict):
            option_text = option.get("option_text")
            option_label = option.get("option_label")
            if isinstance(option_text, str) and option_text.strip():
                options.append(option_text)
            elif isinstance(option_label, str) and option_label.strip():
                options.append(option_label)
        elif isinstance(option, str) and option.strip():
            options.append(option)

    return options


def assign_paper_to_user(
    db: Session, payload: PaperAssignmentCreate, assigned_by: int
) -> PaperAssignment:
    user = (
        db.query(User)
        .filter(
            User.id == payload.user_id,
            User.role == "user",
            User.is_active.is_(True),
        )
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=f"Active user {payload.user_id} not found",
        )

    paper = (
        db.query(Paper)
        .filter(Paper.id == payload.paper_id, Paper.is_active.is_(True))
        .first()
    )
    if not paper:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=f"Active paper {payload.paper_id} not found",
        )

    existing_assignment = (
        db.query(PaperAssignment)
        .filter(
            PaperAssignment.user_id == payload.user_id,
            PaperAssignment.assigned_date == payload.assigned_date,
        )
        .first()
    )

    if existing_assignment:
        existing_assignment.paper_id = payload.paper_id
        existing_assignment.department_id = payload.department_id
        existing_assignment.test_level_id = payload.test_level_id
        existing_assignment.assigned_by = assigned_by
        db.commit()
        db.refresh(existing_assignment)
        return get_assignment_by_user_and_date(
            db, user_id=payload.user_id, assigned_date=payload.assigned_date
        )

    assignment = PaperAssignment(
        user_id=payload.user_id,
        paper_id=payload.paper_id,
        department_id=payload.department_id,
        test_level_id=payload.test_level_id,
        assigned_date=payload.assigned_date,
        assigned_by=assigned_by,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return get_assignment_by_user_and_date(
        db, user_id=payload.user_id, assigned_date=payload.assigned_date
    )



def get_assignment_by_user_and_date(
    db: Session, user_id: int, assigned_date: date
) -> PaperAssignment | None:
    result = (
        _build_assignment_query(db)
        .filter(
            PaperAssignment.user_id == user_id,
            PaperAssignment.assigned_date == assigned_date,
        )
        .first()
    )
    return _hydrate_assignment_result(result)


def get_my_interview_paper(
    db: Session, user_id: int, assigned_date: date | None = None
) -> dict | None:
    effective_date = assigned_date or date.today()
    assignment = get_assignment_by_user_and_date(
        db=db,
        user_id=user_id,
        assigned_date=effective_date,
    )
    if not assignment:
        return None

    paper = get_paper(db, assignment.paper_id)
    if not paper or not paper.is_active:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=f"Active paper {assignment.paper_id} not found",
        )

    question_ids = _extract_question_ids(paper.question_id)
    if not question_ids:
        raise HTTPException(
            status_code=StatusCode.BAD_REQUEST,
            detail="Assigned paper does not contain any questions",
        )

    question_rows = question_repository.get_questions_by_ids(question_ids)
    question_by_id = {question["id"]: question for question in question_rows}
    ordered_questions = [
        question_by_id[question_id]
        for question_id in question_ids
        if question_id in question_by_id and question_by_id[question_id].get("is_active")
    ]

    subject_config = (
        sorted(
            [
                item
                for item in (paper.subject_ids_data or [])
                if isinstance(item, dict) and item.get("is_selected")
            ],
            key=lambda item: item.get("order", 0),
        )
        if isinstance(paper.subject_ids_data, list)
        else []
    )

    subject_ids = [
        item.get("subject_id")
        for item in subject_config
        if isinstance(item.get("subject_id"), int)
    ]
    subject_rows = (
        db.query(Classification)
        .filter(Classification.id.in_(subject_ids))
        .all()
        if subject_ids
        else []
    )
    subject_by_id = {subject.id: subject for subject in subject_rows}

    sections: list[dict] = []
    sections_by_code: dict[str, dict] = {}

    for item in subject_config:
        subject_id = item.get("subject_id")
        subject = subject_by_id.get(subject_id)
        if not subject:
            continue

        section = {
            "id": subject.code.lower(),
            "code": subject.code,
            "title": subject.name,
            "duration_minutes": int(item.get("time_minutes") or 0),
            "total_marks": int(item.get("total_marks") or 0),
            "question_count": int(item.get("question_count") or 0),
            "questions": [],
        }
        sections.append(section)
        sections_by_code[subject.code] = section

    for question in ordered_questions:
        subject = question.get("subject") or {}
        subject_code = subject.get("code") or "GENERAL"
        subject_name = subject.get("name") or "General"

        if subject_code not in sections_by_code:
            fallback_section = {
                "id": subject_code.lower(),
                "code": subject_code,
                "title": subject_name,
                "duration_minutes": 0,
                "total_marks": 0,
                "question_count": 0,
                "questions": [],
            }
            sections.append(fallback_section)
            sections_by_code[subject_code] = fallback_section

        sections_by_code[subject_code]["questions"].append(
            {
                "id": question["id"],
                "type": _resolve_question_type(question),
                "question_text": question["question_text"],
                "subject_name": question.get("subject", {}).get("name") if question.get("subject") else None,
                "type_name": question.get("question_type", {}).get("name") if question.get("question_type") else None,
                "image_url": question.get("image_url"),
                "passage": question.get("passage"),
                "marks": question.get("marks"),
                "options": _sanitize_options(question.get("options")),
            }
        )

    sections = [section for section in sections if section["questions"]]

    for section in sections:
        section["question_count"] = len(section["questions"])
        if not section["total_marks"]:
            section["total_marks"] = sum(
                int(question.get("marks") or 0) for question in section["questions"]
            )

    return {
        "assignment_id": assignment.id,
        "assigned_date": effective_date,
        "paper": {
            "id": paper.id,
            "paper_name": paper.paper_name,
            "description": paper.description,
            "total_time": paper.total_time,
            "total_marks": paper.total_marks,
            "grade": paper.grade,
            "department_name": getattr(paper, "department_name", None),
            "test_level_name": getattr(paper, "test_level_name", None),
        },
        "total_questions": sum(len(section["questions"]) for section in sections),
        "overall_duration_minutes": sum(
            int(section["duration_minutes"]) for section in sections
        ),
        "sections": sections,
    }
