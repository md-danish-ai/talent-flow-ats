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

from sqlalchemy import func
from .models import PaperAssignment, AutoAssignmentRule
from .schemas import (
    PaperAssignmentCreate,
    AutoAssignmentRuleCreate,
    AutoAssignmentRuleUpdate,
)
from app.departments.models import Department


def create_auto_assignment_rule(
    db: Session, payload: AutoAssignmentRuleCreate, created_by: int
) -> AutoAssignmentRule:
    # Check for existing rule to prevent UniqueConstraint violation
    existing = (
        db.query(AutoAssignmentRule)
        .filter(
            AutoAssignmentRule.department_id == payload.department_id,
            AutoAssignmentRule.test_level_id == payload.test_level_id,
            AutoAssignmentRule.assigned_date == payload.assigned_date,
        )
        .first()
    )

    if existing:
        existing.paper_ids = payload.paper_ids
        existing.is_active = payload.is_active
        existing.created_by = created_by
    else:
        existing = AutoAssignmentRule(
            **payload.model_dump(),
            created_by=created_by,
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)
    
    # Backfill for existing users if rule is created for Today
    backfill_assignments_for_rule(db, existing)
    
    return get_auto_assignment_rule(db, existing.id)


def get_auto_assignment_rule(db: Session, rule_id: int) -> AutoAssignmentRule | None:
    result = (
        db.query(
            AutoAssignmentRule,
            Department.name.label("department_name"),
            Classification.name.label("test_level_name"),
        )
        .join(Department, AutoAssignmentRule.department_id == Department.id)
        .join(Classification, AutoAssignmentRule.test_level_id == Classification.id)
        .filter(AutoAssignmentRule.id == rule_id)
        .first()
    )

    if not result:
        return None

    rule, dept_name, level_name = result
    rule.department_name = dept_name
    rule.test_level_name = level_name
    
    # Fetch paper names
    if rule.paper_ids:
        papers = db.query(Paper.paper_name).filter(Paper.id.in_(rule.paper_ids)).all()
        rule.paper_names = [p.paper_name for p in papers]
    else:
        rule.paper_names = []
        
    return rule


def get_auto_assignment_rules(
    db: Session, 
    assigned_date: date | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
) -> list[AutoAssignmentRule]:
    query = db.query(
        AutoAssignmentRule,
        Department.name.label("department_name"),
        Classification.name.label("test_level_name"),
    ).join(Department, AutoAssignmentRule.department_id == Department.id).join(
        Classification, AutoAssignmentRule.test_level_id == Classification.id
    )

    if assigned_date:
        query = query.filter(AutoAssignmentRule.assigned_date == assigned_date)
    if date_from:
        query = query.filter(AutoAssignmentRule.assigned_date >= date_from)
    if date_to:
        query = query.filter(AutoAssignmentRule.assigned_date <= date_to)

    results = query.order_by(AutoAssignmentRule.id.desc()).all()

    # Pre-fetch all relevant paper names to avoid N+1 queries
    all_paper_ids = []
    for rule, _, _ in results:
        if rule.paper_ids:
            all_paper_ids.extend(rule.paper_ids)
    
    paper_map = {}
    if all_paper_ids:
        papers = db.query(Paper.id, Paper.paper_name).filter(Paper.id.in_(list(set(all_paper_ids)))).all()
        paper_map = {p.id: p.paper_name for p in papers}

    final_rules = []
    for rule, dept_name, level_name in results:
        rule.department_name = dept_name
        rule.test_level_name = level_name
        rule.paper_names = [paper_map.get(p_id, f"#{p_id}") for p_id in (rule.paper_ids or [])]
        final_rules.append(rule)

    return final_rules


def update_auto_assignment_rule(
    db: Session, rule_id: int, payload: AutoAssignmentRuleUpdate
) -> AutoAssignmentRule:
    rule = (
        db.query(AutoAssignmentRule).filter(AutoAssignmentRule.id == rule_id).first()
    )
    if not rule:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND, detail="Auto-assignment rule not found"
        )

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(rule, key, value)

    db.commit()
    db.refresh(rule)
    
    # Backfill for existing users if rule is updated
    backfill_assignments_for_rule(db, rule)
    
    return get_auto_assignment_rule(db, rule.id)


def delete_auto_assignment_rule(db: Session, rule_id: int) -> dict:
    rule = (
        db.query(AutoAssignmentRule).filter(AutoAssignmentRule.id == rule_id).first()
    )
    if not rule:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND, detail="Auto-assignment rule not found"
        )

    db.delete(rule)
    db.commit()
    return {"message": "Rule deleted successfully"}


def backfill_assignments_for_rule(db: Session, rule: AutoAssignmentRule):
    """
    Optimized Bulk Backfill:
    Finds all unassigned users matching the rule and assigns them papers
    in a single transaction using in-memory distribution logic.
    """
    if not rule.is_active or not rule.paper_ids:
        return

    # 1. Find all users matching Dept/Level
    matching_users = (
        db.query(User.id)
        .filter(
            User.department_id == rule.department_id,
            User.test_level_id == rule.test_level_id,
            User.role == "user",
            User.is_active.is_(True),
        )
        .all()
    )
    user_ids = [u.id for u in matching_users]
    if not user_ids:
        return

    # 2. Filter out users who ALREADY have an assignment for this date
    existing_assignments = (
        db.query(PaperAssignment.user_id)
        .filter(
            PaperAssignment.assigned_date == rule.assigned_date,
            PaperAssignment.user_id.in_(user_ids),
        )
        .all()
    )
    already_assigned_user_ids = {a.user_id for a in existing_assignments}
    pending_user_ids = [uid for uid in user_ids if uid not in already_assigned_user_ids]

    if not pending_user_ids:
        return

    # 3. Bulk Distribution Logic
    paper_ids = rule.paper_ids if isinstance(rule.paper_ids, list) else []
    if not paper_ids:
        return

    # Get current counts for papers today
    counts = (
        db.query(
            PaperAssignment.paper_id, func.count(PaperAssignment.id).label("total")
        )
        .filter(
            PaperAssignment.assigned_date == rule.assigned_date,
            PaperAssignment.paper_id.in_(paper_ids),
        )
        .group_by(PaperAssignment.paper_id)
        .all()
    )

    count_map = {p_id: 0 for p_id in paper_ids}
    for p_id, total in counts:
        count_map[p_id] = total

    new_assignments = []
    for uid in pending_user_ids:
        # Pick paper with minimum current/simulated assignments
        best_paper_id = sorted(paper_ids, key=lambda p: count_map[p])[0]
        
        assignment = PaperAssignment(
            user_id=uid,
            paper_id=best_paper_id,
            department_id=rule.department_id,
            test_level_id=rule.test_level_id,
            assigned_date=rule.assigned_date,
            assigned_by=rule.created_by,
            assignment_source="AUTO",
            auto_rule_id=rule.id,
        )
        new_assignments.append(assignment)
        
        # Increment counter in-memory to ensure even distribution during this loop
        count_map[best_paper_id] += 1

    # 4. One Single Transaction for all assignments
    if new_assignments:
        db.add_all(new_assignments)
        db.commit()


def assign_best_paper(
    db: Session,
    user_id: int,
    department_id: int,
    test_level_id: int,
    assigned_date: date,
) -> PaperAssignment | None:
    # 1. Find the active rule for this Dept/Level on this Date
    rule = (
        db.query(AutoAssignmentRule)
        .filter(
            AutoAssignmentRule.department_id == department_id,
            AutoAssignmentRule.test_level_id == test_level_id,
            AutoAssignmentRule.assigned_date == assigned_date,
            AutoAssignmentRule.is_active.is_(True),
        )
        .first()
    )

    if not rule or not rule.paper_ids:
        return None

    # 2. Sequential/Round-robin: Check assignment counts for papers in the pool
    # We want the paper with the MINIMUM number of assignments today
    paper_ids = rule.paper_ids if isinstance(rule.paper_ids, list) else []

    if not paper_ids:
        return None

    # Subquery to get counts for these specific papers today
    counts = (
        db.query(
            PaperAssignment.paper_id, func.count(PaperAssignment.id).label("total")
        )
        .filter(
            PaperAssignment.assigned_date == assigned_date,
            PaperAssignment.paper_id.in_(paper_ids),
        )
        .group_by(PaperAssignment.paper_id)
        .all()
    )

    count_map = {p_id: 0 for p_id in paper_ids}
    for p_id, total in counts:
        count_map[p_id] = total

    # Sort paper_ids by their current count (ascending) to pick the one with the least assignments
    best_paper_id = sorted(paper_ids, key=lambda p: count_map.get(p, 0))[0]

    # 3. Check if user already has an assignment for today
    existing = (
        db.query(PaperAssignment)
        .filter(
            PaperAssignment.user_id == user_id,
            PaperAssignment.assigned_date == assigned_date,
        )
        .first()
    )

    if existing:
        return existing

    # 4. Create the assignment
    assignment = PaperAssignment(
        user_id=user_id,
        paper_id=best_paper_id,
        department_id=department_id,
        test_level_id=test_level_id,
        assigned_date=assigned_date,
        assigned_by=rule.created_by,  # Rule creator is the 'assigner'
        assignment_source="AUTO",
        auto_rule_id=rule.id,
    )

    db.add(assignment)
    
    # Update user status to ready
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.process_status = "ready"
        
    db.commit()
    db.refresh(assignment)

    return get_assignment_by_user_and_date(db, user_id, assigned_date)


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
        return "IMAGE_MULTIPLE_CHOICE"
    if type_code in {"IMAGE_SUBJECTIVE", "IMAGE_DESCRIPTIVE", "IMAGE_WRITTEN"}:
        return "IMAGE_SUBJECTIVE"
    if type_code in {"PASSAGE_CONTENT", "PASSAGE_ANALYSIS"}:
        return "PASSAGE_CONTENT"
    if type_code == "SUBJECTIVE":
        return "SUBJECTIVE"
    if type_code == "MULTIPLE_CHOICE":
        return "MULTIPLE_CHOICE"
    if type_code == "TYPING_TEST":
        return "TYPING_TEST"
    if type_code == "LEAD_GENERATION":
        return "LEAD_GENERATION"
    if type_code == "CONTACT_DETAILS":
        return "CONTACT_DETAILS"

    # Fallback heuristics
    if question.get("passage"):
        return "PASSAGE_CONTENT"
    if question.get("image_url"):
        # If it has image but NO options, it's likely an image-based subjective
        if question.get("options"):
            return "IMAGE_MULTIPLE_CHOICE"
        return "IMAGE_SUBJECTIVE"
    if question.get("options"):
        return "MULTIPLE_CHOICE"
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
    
    # Update user status to ready
    user = db.query(User).filter(User.id == payload.user_id).first()
    if user:
        user.process_status = "ready"
        
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
