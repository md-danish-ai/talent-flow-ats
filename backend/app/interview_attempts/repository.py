from __future__ import annotations

import json
import math
import re
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import HTTPException
from sqlalchemy import desc, func
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.classifications.models import Classification
from app.database.db import SessionLocal
from app.papers.models import Paper
from app.paper_assignments.models import PaperAssignment
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.users.models import User
from app.utils.status_codes import StatusCode
from app.user_details.models import UserDetail
from .models import InterviewRecord

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

ACTIVE_STATUSES = {"started"}


# ---------------------------------------------------------------------------
# Private text-matching helpers
# ---------------------------------------------------------------------------

def _normalize_text(value: str) -> str:
    return " ".join(value.strip().lower().split())


def _extract_option_key(value: str) -> str | None:
    match = re.match(r"^\s*([a-z0-9]+)\s*[\.\)\:\-]?", value.strip(), flags=re.I)
    if not match:
        return None
    return match.group(1).lower()


def _split_answer_values(raw_value: str) -> list[str]:
    return [part.strip() for part in raw_value.split(",") if part.strip()]


def _is_answer_correct(user_answer: str, correct_answer: str) -> bool:
    normalized_user = _normalize_text(user_answer)
    normalized_correct = _normalize_text(correct_answer)
    if not normalized_user or not normalized_correct:
        return False
    if normalized_user == normalized_correct:
        return True
    user_parts = _split_answer_values(user_answer)
    correct_parts = _split_answer_values(correct_answer)
    user_keys = {_extract_option_key(p) or _normalize_text(p) for p in user_parts}
    correct_keys = {_extract_option_key(p) or _normalize_text(p) for p in correct_parts}
    return user_keys == correct_keys


# ---------------------------------------------------------------------------
# Private paper / question helpers
# ---------------------------------------------------------------------------

def _extract_question_ids(question_payload: Any) -> list[int]:
    ids: list[int] = []

    def walk(value: Any) -> None:
        if isinstance(value, int):
            ids.append(value)
        elif isinstance(value, str) and value.strip().isdigit():
            ids.append(int(value.strip()))
        elif isinstance(value, list):
            for item in value:
                walk(item)
        elif isinstance(value, dict):
            for item in value.values():
                walk(item)

    walk(question_payload)
    return list(dict.fromkeys(ids))


def _get_record_or_404(db: Session, record_id: int, user_id: int) -> InterviewRecord:
    record = (
        db.query(InterviewRecord)
        .filter(InterviewRecord.id == record_id, InterviewRecord.user_id == user_id)
        .first()
    )
    if not record:
        raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Attempt not found")
    return record


def _get_paper_or_404(db: Session, paper_id: int) -> Paper:
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=StatusCode.NOT_FOUND, detail=f"Paper {paper_id} not found")
    return paper


def _resolve_question_section(db: Session, question: Question) -> tuple[str, str]:
    default_code = (question.subject_type or "").strip() or "GENERAL"
    classification = (
        db.query(Classification)
        .filter(Classification.code == default_code, Classification.type == "subject")
        .first()
    )
    if classification:
        return classification.code, classification.name
    return default_code, default_code.replace("_", " ").title()


def _get_total_duration_minutes(paper: Paper) -> int:
    subject_data = paper.subject_ids_data if isinstance(paper.subject_ids_data, list) else []
    return sum(
        int(item.get("time_minutes") or 0)
        for item in subject_data
        if isinstance(item, dict) and item.get("is_selected")
    )


def _sort_subject_results_by_paper_order(
    db: Session,
    paper: Paper | None,
    subject_results: list[dict] | None,
) -> list[dict]:
    results = list(subject_results or [])
    if not paper or not results:
        return results

    subject_data = paper.subject_ids_data if isinstance(paper.subject_ids_data, list) else []
    selected_subjects = [
        item for item in subject_data if isinstance(item, dict) and item.get("is_selected")
    ]
    if not selected_subjects:
        return results

    subject_ids = [
        int(item["subject_id"])
        for item in selected_subjects
        if str(item.get("subject_id") or "").isdigit()
    ]
    classifications = (
        db.query(Classification).filter(Classification.id.in_(subject_ids)).all()
        if subject_ids
        else []
    )
    classification_by_id = {classification.id: classification for classification in classifications}

    order_map: dict[str, int] = {}
    for fallback_index, item in enumerate(
        sorted(selected_subjects, key=lambda value: int(value.get("order") or 0))
    ):
        subject_id = int(item.get("subject_id") or 0)
        classification = classification_by_id.get(subject_id)
        sort_index = int(item.get("order") or fallback_index)

        for value in (
            item.get("subject_name"),
            classification.code if classification else None,
            classification.name if classification else None,
        ):
            if value:
                order_map[_normalize_text(str(value))] = sort_index

    if not order_map:
        return results

    return [
        result
        for _, result in sorted(
            enumerate(results),
            key=lambda pair: (
                min(
                    order_map.get(
                        _normalize_text(str(pair[1].get("section_code") or "")),
                        math.inf,
                    ),
                    order_map.get(
                        _normalize_text(str(pair[1].get("section_name") or "")),
                        math.inf,
                    ),
                ),
                pair[0],
            ),
        )
    ]


# ---------------------------------------------------------------------------
# Grade computation helpers
# ---------------------------------------------------------------------------

def _get_grade_label(percentage: float, grade_settings: list) -> str:
    for gs in grade_settings:
        if isinstance(gs, dict) and gs.get("min", 0) <= percentage <= gs.get("max", 100):
            return gs.get("grade_label", "N/A")
    return "N/A"


def _recompute_grades(record: InterviewRecord, db: Session, paper_obj: Paper | None = None) -> None:
    """
    Recompute obtained_marks, total_marks, overall_grade, subject_grades
    from record.responses JSON array. Modifies record in-place (caller must commit).
    """
    if paper_obj is None:
        paper_obj = db.query(Paper).filter(Paper.id == record.paper_id).first()

    grade_settings: list = (paper_obj.grade_settings or []) if paper_obj else []
    responses: list[dict] = list(record.responses or [])

    if not responses:
        record.total_marks = 0
        record.obtained_marks = 0
        record.overall_grade = "N/A"
        record.subject_grades = []
        return

    question_ids = [r["question_id"] for r in responses]

    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    questions_map: dict[int, Question] = {q.id: q for q in questions}

    correct_answers = (
        db.query(QuestionAnswer)
        .filter(QuestionAnswer.question_id.in_(question_ids))
        .all()
    )
    correct_answers_map: dict[int, QuestionAnswer] = {ca.question_id: ca for ca in correct_answers}

    # Maintain insertion order for sections
    section_order: list[str] = []
    section_stats: dict[str, dict] = {}

    for resp in responses:
        qid = resp.get("question_id")
        question = questions_map.get(qid)
        if not question:
            continue

        s_name = resp.get("section_name", "General")
        s_code = resp.get("section_code", "GENERAL")

        if s_name not in section_stats:
            section_order.append(s_name)
            section_stats[s_name] = {
                "section_code": s_code,
                "section_name": s_name,
                "total_marks": 0.0,
                "obtained_marks": 0.0,
                "total_questions": 0,
                "attempted_count": 0,
                "correct_count": 0,
                "incorrect_count": 0,
                "unattempted_count": 0,
            }

        stats = section_stats[s_name]
        q_marks = float(question.marks or 0)
        stats["total_marks"] += q_marks
        stats["total_questions"] += 1

        is_attempted = resp.get("is_attempted", False)

        if not is_attempted:
            stats["unattempted_count"] += 1
        else:
            stats["attempted_count"] += 1
            manual_marks = resp.get("manual_marks")

            if manual_marks is not None:
                obtained = float(manual_marks)
                stats["obtained_marks"] += obtained
                if obtained > 0:
                    stats["correct_count"] += 1
                else:
                    stats["incorrect_count"] += 1
            else:
                correct_answer = correct_answers_map.get(qid)
                correct_text = (correct_answer.answer_text if correct_answer else "") or ""
                user_text = (resp.get("answer_text") or "").strip()

                is_correct = _is_answer_correct(user_text, correct_text) if correct_text.strip() else False

                if is_correct:
                    stats["correct_count"] += 1
                    stats["obtained_marks"] += q_marks
                else:
                    stats["incorrect_count"] += 1

    total_obtained = 0.0
    total_max = 0.0
    subject_grades: list[dict] = []

    for s_name in section_order:
        stats = section_stats[s_name]
        pct = (stats["obtained_marks"] / stats["total_marks"] * 100) if stats["total_marks"] > 0 else 0
        subject_grades.append({
            "section_code": stats["section_code"],
            "section_name": s_name,
            "total_marks": round(stats["total_marks"], 2),
            "obtained_marks": round(stats["obtained_marks"], 2),
            "percentage": round(pct, 2),
            "grade": _get_grade_label(pct, grade_settings),
            "total_questions": stats["total_questions"],
            "attempted_count": stats["attempted_count"],
            "correct_count": stats["correct_count"],
            "incorrect_count": stats["incorrect_count"],
            "unattempted_count": stats["unattempted_count"],
        })
        total_obtained += stats["obtained_marks"]
        total_max += stats["total_marks"]

    overall_pct = (total_obtained / total_max * 100) if total_max > 0 else 0

    record.obtained_marks = round(total_obtained, 2)
    record.total_marks = round(total_max, 2)
    record.overall_grade = _get_grade_label(overall_pct, grade_settings)
    record.subject_grades = _sort_subject_results_by_paper_order(db, paper_obj, subject_grades)
    flag_modified(record, "subject_grades")


# ---------------------------------------------------------------------------
# Materialization helper
# ---------------------------------------------------------------------------

def _materialize_unanswered_entries(
    db: Session, record: InterviewRecord, is_auto_saved: bool
) -> None:
    """Append blank response entries for questions not yet in responses JSON."""
    paper = _get_paper_or_404(db, record.paper_id)
    question_ids = _extract_question_ids(paper.question_id)
    record.total_questions = len(question_ids)

    existing = list(record.responses or [])
    answered_ids = {r["question_id"] for r in existing}
    missing_ids = [qid for qid in question_ids if qid not in answered_ids]

    if not missing_ids:
        return

    questions = db.query(Question).filter(Question.id.in_(missing_ids)).all()
    questions_map = {q.id: q for q in questions}
    now = datetime.utcnow().isoformat()

    new_entries: list[dict] = []
    for qid in missing_ids:
        q = questions_map.get(qid)
        if not q:
            continue
        s_code, s_name = _resolve_question_section(db, q)
        new_entries.append({
            "question_id": qid,
            "section_code": s_code,
            "section_name": s_name,
            "answer_text": None,
            "is_attempted": False,
            "is_auto_saved": is_auto_saved,
            "is_skipped": False,
            "manual_marks": None,
            "saved_at": now,
        })

    record.responses = existing + new_entries
    flag_modified(record, "responses")


# ---------------------------------------------------------------------------
# Saved-responses serializer (for resume)
# ---------------------------------------------------------------------------

def _serialize_saved_responses(record: InterviewRecord) -> list[dict]:
    return [
        {
            "question_id": r["question_id"],
            "section_code": r.get("section_code", ""),
            "section_name": r.get("section_name", ""),
            "answer_text": r.get("answer_text"),
            "is_attempted": r.get("is_attempted", False),
            "is_auto_saved": r.get("is_auto_saved", False),
            "saved_at": r.get("saved_at"),
        }
        for r in (record.responses or [])
    ]


# ===========================================================================
# Public repository functions
# ===========================================================================


def start_attempt(paper_id: int, user_id: int) -> dict:
    db = SessionLocal()
    try:
        paper = _get_paper_or_404(db, paper_id)
        question_ids = _extract_question_ids(paper.question_id)
        total_dur = _get_total_duration_minutes(paper)

        existing = (
            db.query(InterviewRecord)
            .filter(
                InterviewRecord.paper_id == paper_id,
                InterviewRecord.user_id == user_id,
                InterviewRecord.status.in_(ACTIVE_STATUSES),
            )
            .order_by(desc(InterviewRecord.id))
            .first()
        )

        if existing:
            # Server-side timer enforcement
            if total_dur > 0 and existing.status == "started":
                started_utc = existing.started_at
                if started_utc.tzinfo is None:
                    started_utc = started_utc.replace(tzinfo=timezone.utc)
                expiry = started_utc + timedelta(minutes=total_dur)
                if datetime.now(timezone.utc) > expiry:
                    finalize_attempt(
                        record_id=existing.id,
                        user_id=user_id,
                        status="auto_submitted",
                        completion_reason="time_over",
                        is_auto_submitted=True,
                        db=db,
                    )
                    db.refresh(existing)
                    if existing.status != "started":
                        raise HTTPException(
                            status_code=StatusCode.BAD_REQUEST,
                            detail="Interview time has expired. Participation closed.",
                        )

            return {
                "attempt_id": existing.id,
                "paper_id": existing.paper_id,
                "user_id": existing.user_id,
                "status": existing.status,
                "total_questions": existing.total_questions,
                "started_at": existing.started_at.replace(tzinfo=timezone.utc)
                if existing.started_at.tzinfo is None
                else existing.started_at,
                "is_resumed": True,
                "paper_question_ids": question_ids,
                "total_duration_minutes": total_dur,
                "saved_responses": _serialize_saved_responses(existing),
            }

        record = InterviewRecord(
            paper_id=paper_id,
            user_id=user_id,
            status="started",
            total_questions=len(question_ids),
            attempted_count=0,
            unattempted_count=len(question_ids),
            is_auto_submitted=False,
            started_at=datetime.now(timezone.utc),
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "attempt_id": record.id,
            "paper_id": record.paper_id,
            "user_id": record.user_id,
            "status": record.status,
            "total_questions": record.total_questions,
            "started_at": record.started_at,
            "is_resumed": False,
            "paper_question_ids": question_ids,
            "total_duration_minutes": total_dur,
            "saved_responses": [],
        }

    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def save_answer(
    record_id: int,
    question_id: int,
    user_id: int,
    answer_text: str | None,
    is_auto_saved: bool,
) -> dict:
    db = SessionLocal()
    try:
        record = _get_record_or_404(db, record_id, user_id)

        if record.status != "started":
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Cannot save answer. Attempt is already submitted.",
            )

        paper_question_ids = set(_extract_question_ids(
            _get_paper_or_404(db, record.paper_id).question_id
        ))
        if question_id not in paper_question_ids:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Question does not belong to the paper for this attempt.",
            )

        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail=f"Question {question_id} not found")

        normalized = (answer_text or "").strip()
        is_attempted = bool(normalized)
        s_code, s_name = _resolve_question_section(db, question)
        now = datetime.utcnow().isoformat()

        responses: list[dict] = list(record.responses or [])
        found = False
        for resp in responses:
            if resp.get("question_id") == question_id:
                resp["answer_text"] = normalized or None
                resp["is_attempted"] = is_attempted
                resp["is_auto_saved"] = is_auto_saved
                resp["section_code"] = s_code
                resp["section_name"] = s_name
                resp["saved_at"] = now
                found = True
                break

        if not found:
            responses.append({
                "question_id": question_id,
                "section_code": s_code,
                "section_name": s_name,
                "answer_text": normalized or None,
                "is_attempted": is_attempted,
                "is_auto_saved": is_auto_saved,
                "is_skipped": False,
                "manual_marks": None,
                "saved_at": now,
            })

        record.responses = responses
        flag_modified(record, "responses")

        attempted_count = sum(1 for r in responses if r.get("is_attempted"))
        record.attempted_count = attempted_count
        record.unattempted_count = max(record.total_questions - attempted_count, 0)

        db.commit()

        return {
            "attempt_id": record_id,
            "question_id": question_id,
            "section_code": s_code,
            "section_name": s_name,
            "is_attempted": is_attempted,
            "is_auto_saved": is_auto_saved,
            "saved_at": now,
        }

    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def save_answers_batch(
    record_id: int,
    user_id: int,
    answers: list[dict],
) -> dict:
    db = SessionLocal()
    try:
        record = _get_record_or_404(db, record_id, user_id)

        if record.status != "started":
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Cannot save answers. Attempt is already submitted.",
            )

        # Get all valid question IDs for this paper
        paper_question_ids = set(_extract_question_ids(
            _get_paper_or_404(db, record.paper_id).question_id
        ))

        # Get all questions info in one query for section resolution
        q_ids_to_fetch = [a["question_id"] for a in answers if a["question_id"] in paper_question_ids]
        questions = db.query(Question).filter(Question.id.in_(q_ids_to_fetch)).all()
        questions_map = {q.id: q for q in questions}

        now = datetime.utcnow().isoformat()
        responses: list[dict] = list(record.responses or [])
        resp_map = {r["question_id"]: r for r in responses}

        for entry in answers:
            qid = entry["question_id"]
            if qid not in paper_question_ids:
                continue

            question = questions_map.get(qid)
            if not question:
                continue

            normalized = (entry.get("answer_text") or "").strip()
            is_attempted = bool(normalized)
            s_code, s_name = _resolve_question_section(db, question)

            if qid in resp_map:
                resp = resp_map[qid]
                resp["answer_text"] = normalized or None
                resp["is_attempted"] = is_attempted
                resp["is_auto_saved"] = entry.get("is_auto_saved", False)
                resp["section_code"] = s_code
                resp["section_name"] = s_name
                resp["saved_at"] = now
            else:
                new_resp = {
                    "question_id": qid,
                    "section_code": s_code,
                    "section_name": s_name,
                    "answer_text": normalized or None,
                    "is_attempted": is_attempted,
                    "is_auto_saved": entry.get("is_auto_saved", False),
                    "is_skipped": False,
                    "manual_marks": None,
                    "saved_at": now,
                }
                responses.append(new_resp)
                resp_map[qid] = new_resp

        record.responses = responses
        flag_modified(record, "responses")

        attempted_count = sum(1 for r in responses if r.get("is_attempted"))
        record.attempted_count = attempted_count
        record.unattempted_count = max(record.total_questions - attempted_count, 0)

        db.commit()

        return {
            "attempt_id": record_id,
            "count": len(answers),
            "saved_at": now,
        }

    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def finalize_attempt(
    record_id: int,
    user_id: int,
    status: str,
    completion_reason: str,
    is_auto_submitted: bool,
    db: Session | None = None,
) -> dict:
    own_session = db is None
    if own_session:
        db = SessionLocal()
    try:
        record = _get_record_or_404(db, record_id, user_id)

        if record.status != "started":
            return get_attempt_summary(record_id, user_id)

        # 1. Materialize unanswered questions
        _materialize_unanswered_entries(db, record, is_auto_saved=is_auto_submitted)

        # 2. Recount
        attempted_count = sum(1 for r in (record.responses or []) if r.get("is_attempted"))
        record.attempted_count = attempted_count
        record.unattempted_count = max(record.total_questions - attempted_count, 0)

        # 3. Status + timestamps
        record.status = status
        record.completion_reason = completion_reason
        record.is_auto_submitted = is_auto_submitted
        record.submitted_at = datetime.utcnow()

        # 4. Compute and store grades permanently
        paper_obj = _get_paper_or_404(db, record.paper_id)
        _recompute_grades(record, db, paper_obj)

        # 5. Update UserDetail
        user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        if user_detail:
            user_detail.is_interview_submitted = True

        # 6. Update PaperAssignment
        today = datetime.utcnow().date()
        assignment = (
            db.query(PaperAssignment)
            .filter(PaperAssignment.user_id == user_id, PaperAssignment.assigned_date == today)
            .first()
        )
        if assignment:
            assignment.is_attempted = True

        db.commit()
        db.refresh(record)

        return {
            "attempt_id": record.id,
            "paper_id": record.paper_id,
            "user_id": record.user_id,
            "status": record.status,
            "completion_reason": record.completion_reason,
            "started_at": record.started_at,
            "submitted_at": record.submitted_at,
            "total_questions": record.total_questions,
            "attempted_count": record.attempted_count,
            "unattempted_count": record.unattempted_count,
            "total_marks": float(record.total_marks),
            "obtained_marks": float(record.obtained_marks),
            "overall_grade": record.overall_grade,
            "is_auto_submitted": record.is_auto_submitted,
        }

    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        if own_session:
            db.close()


def get_attempt_summary(record_id: int, user_id: int) -> dict:
    db = SessionLocal()
    try:
        record = _get_record_or_404(db, record_id, user_id)
        return {
            "attempt_id": record.id,
            "paper_id": record.paper_id,
            "user_id": record.user_id,
            "status": record.status,
            "completion_reason": record.completion_reason,
            "started_at": record.started_at,
            "submitted_at": record.submitted_at,
            "total_questions": record.total_questions,
            "attempted_count": record.attempted_count,
            "unattempted_count": record.unattempted_count,
            "total_marks": float(record.total_marks),
            "obtained_marks": float(record.obtained_marks),
            "overall_grade": record.overall_grade,
            "is_auto_submitted": record.is_auto_submitted,
        }
    finally:
        db.close()


def get_admin_user_results(
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    status: str | None = None,
    completion_reason: str | None = None,
    overall_grade: str | None = None,
    page: int = 1,
    limit: int = 10,
) -> dict:
    db = SessionLocal()
    try:
        latest_record_ids_query = (
            db.query(func.max(InterviewRecord.id).label("latest_record_id"))
            .join(User, User.id == InterviewRecord.user_id)
            .filter(User.role == "user")
        )

        if search:
            pattern = f"%{search.strip()}%"
            latest_record_ids_query = latest_record_ids_query.filter(
                (User.username.ilike(pattern))
                | (User.mobile.ilike(pattern))
                | (User.email.ilike(pattern))
            )

        if start_date:
            latest_record_ids_query = latest_record_ids_query.filter(
                InterviewRecord.started_at >= f"{start_date} 00:00:00"
            )
        if end_date:
            latest_record_ids_query = latest_record_ids_query.filter(
                InterviewRecord.started_at <= f"{end_date} 23:59:59"
            )

        latest_record_ids = (
            latest_record_ids_query
            .group_by(InterviewRecord.user_id)
            .subquery()
        )

        records_query = (
            db.query(InterviewRecord, User, Paper.paper_name)
            .join(latest_record_ids, latest_record_ids.c.latest_record_id == InterviewRecord.id)
            .join(User, User.id == InterviewRecord.user_id)
            .join(Paper, Paper.id == InterviewRecord.paper_id)
        )

        # Apply post-subquery filters on the actual record columns
        if status and status != "all":
            records_query = records_query.filter(InterviewRecord.status == status)
        if completion_reason and completion_reason != "all":
            records_query = records_query.filter(InterviewRecord.completion_reason == completion_reason)
        if overall_grade and overall_grade != "all":
            records_query = records_query.filter(InterviewRecord.overall_grade == overall_grade)

        total_items = records_query.count()
        total_pages = math.ceil(total_items / limit) if limit > 0 else 0
        records = (
            records_query
            .order_by(desc(InterviewRecord.id))
            .limit(limit)
            .offset((page - 1) * limit)
            .all()
        )

        results: list[dict] = []

        for record, user, paper_name in records:
            attempts_count = (
                db.query(InterviewRecord)
                .filter(InterviewRecord.user_id == user.id)
                .count()
            )

            # Typing stats — parsed from responses JSON if present
            typing_stats = None
            for resp in (record.responses or []):
                answer_text = resp.get("answer_text")
                if answer_text and isinstance(answer_text, str) and answer_text.startswith("{"):
                    try:
                        parsed = json.loads(answer_text)
                        if "stats" in parsed:
                            typing_stats = parsed["stats"]
                            break
                    except Exception:
                        pass

            results.append({
                "user_id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
                "attempts_count": attempts_count,
                "is_reattempt": attempts_count > 1,
                "latest_attempt": {
                    "attempt_id": record.id,
                    "paper_id": record.paper_id,
                    "paper_name": paper_name,
                    "status": record.status,
                    "completion_reason": record.completion_reason,
                    "started_at": record.started_at,
                    "submitted_at": record.submitted_at,
                    "total_questions": record.total_questions,
                    "attempted_count": record.attempted_count,
                    "unattempted_count": record.unattempted_count,
                    "total_marks": float(record.total_marks),
                    "obtained_marks": float(record.obtained_marks),
                    "overall_grade": record.overall_grade,
                    "typing_stats": typing_stats,
                    "subject_results": record.subject_grades,
                },
            })

        return {
            "items": results,
            "total": total_items,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
        }
    finally:
        db.close()


def get_admin_user_attempts(user_id: int) -> dict:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id, User.role == "user").first()
        if not user:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail=f"User {user_id} not found")

        records_with_papers = (
            db.query(InterviewRecord, Paper.paper_name)
            .join(Paper, Paper.id == InterviewRecord.paper_id)
            .filter(InterviewRecord.user_id == user_id)
            .order_by(desc(InterviewRecord.id))
            .all()
        )

        attempts: list[dict] = []
        for record, paper_name in records_with_papers:
            typing_stats = None
            for resp in (record.responses or []):
                user_answer = resp.get("answer_text")
                if user_answer and isinstance(user_answer, str) and user_answer.startswith("{"):
                    try:
                        parsed = json.loads(user_answer)
                        typing_stats = parsed.get("stats")
                    except Exception:
                        pass

            attempts.append({
                "attempt_id": record.id,
                "paper_id": record.paper_id,
                "paper_name": paper_name,
                "status": record.status,
                "completion_reason": record.completion_reason,
                "started_at": record.started_at,
                "submitted_at": record.submitted_at,
                "total_questions": record.total_questions,
                "attempted_count": record.attempted_count,
                "unattempted_count": record.unattempted_count,
                "total_marks": float(record.total_marks),
                "obtained_marks": float(record.obtained_marks),
                "overall_grade": record.overall_grade,
                "is_auto_submitted": record.is_auto_submitted,
                "typing_stats": typing_stats,
                "subject_results": record.subject_grades,
            })

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
            },
            "attempts": attempts,
        }
    finally:
        db.close()


def get_admin_user_result_detail(user_id: int, attempt_id: int | None = None) -> dict:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id, User.role == "user").first()
        if not user:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail=f"User {user_id} not found")

        record_query = db.query(InterviewRecord).filter(InterviewRecord.user_id == user_id)
        if attempt_id is not None:
            record_query = record_query.filter(InterviewRecord.id == attempt_id)
        record = record_query.order_by(desc(InterviewRecord.id)).first()

        if not record:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="No interview attempt found for this user")

        paper_obj = db.query(Paper).filter(Paper.id == record.paper_id).first()

        attempt_number = (
            db.query(InterviewRecord)
            .filter(InterviewRecord.user_id == user_id, InterviewRecord.id <= record.id)
            .count()
        )

        # Build detailed answers using stored responses + live question/answer data
        responses: list[dict] = list(record.responses or [])
        question_ids = [r["question_id"] for r in responses]

        questions = db.query(Question).filter(Question.id.in_(question_ids)).all() if question_ids else []
        questions_map = {q.id: q for q in questions}

        correct_answers = (
            db.query(QuestionAnswer).filter(QuestionAnswer.question_id.in_(question_ids)).all()
            if question_ids else []
        )
        correct_answers_map = {ca.question_id: ca for ca in correct_answers}

        detailed_answers: list[dict] = []
        correct_count = 0
        incorrect_count = 0
        not_attempted_count = 0

        for resp in responses:
            qid = resp["question_id"]
            question = questions_map.get(qid)
            if not question:
                continue

            correct_answer_obj = correct_answers_map.get(qid)
            correct_answer_text = (correct_answer_obj.answer_text if correct_answer_obj else None) or ""
            user_answer_text = (resp.get("answer_text") or "").strip()
            is_attempted = resp.get("is_attempted", False)
            manual_marks = resp.get("manual_marks")

            if not is_attempted:
                status_label = "not_attempted"
                marks_obtained = 0.0
                is_correct = False
                not_attempted_count += 1
            else:
                if manual_marks is not None:
                    marks_obtained = float(manual_marks)
                    is_correct = marks_obtained > 0
                    status_label = "correct" if is_correct else "incorrect"
                else:
                    is_correct = (
                        _is_answer_correct(user_answer_text, correct_answer_text)
                        if correct_answer_text.strip()
                        else False
                    )
                    marks_obtained = float(question.marks or 0) if is_correct else 0.0
                    status_label = "correct" if is_correct else "incorrect"

                if is_correct:
                    correct_count += 1
                else:
                    incorrect_count += 1

            # Typing test special parsing
            user_answer_display = resp.get("answer_text")
            typing_stats = None
            if question.question_type == "TYPING_TEST" and user_answer_text and isinstance(user_answer_text, str) and user_answer_text.startswith("{"):
                try:
                    parsed = json.loads(user_answer_text)
                    user_answer_display = parsed.get("typed_text", user_answer_text)
                    typing_stats = parsed.get("stats")
                except Exception:
                    pass

            detailed_answers.append({
                "question_id": question.id,
                "section_code": resp.get("section_code", ""),
                "section_name": resp.get("section_name", ""),
                "question_type": question.question_type,
                "subject_type": question.subject_type,
                "exam_level": question.exam_level,
                "question_text": question.question_text,
                "passage": question.passage,
                "image_url": question.image_url,
                "options": question.options,
                "max_marks": float(question.marks or 0),
                "user_answer": user_answer_display,
                "typing_stats": typing_stats,
                "correct_answer": correct_answer_text or None,
                "status": status_label,
                "marks_obtained": marks_obtained,
                "manual_marks": float(manual_marks) if manual_marks is not None else None,
                "is_attempted": is_attempted,
                "is_auto_saved": resp.get("is_auto_saved", False),
                "saved_at": resp.get("saved_at"),
            })

        # Grade settings for scale display (not for computation — grades already stored)
        grade_settings = (paper_obj.grade_settings or []) if paper_obj else []
        ordered_subject_results = _sort_subject_results_by_paper_order(
            db,
            paper_obj,
            record.subject_grades,
        )

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
            },
            "attempt": {
                "attempt_id": record.id,
                "paper_id": record.paper_id,
                "paper_name": paper_obj.paper_name if paper_obj else "Unknown Paper",
                "attempt_number": attempt_number,
                "status": record.status,
                "completion_reason": record.completion_reason,
                "started_at": record.started_at,
                "submitted_at": record.submitted_at,
                "total_questions": record.total_questions,
                "attempted_count": record.attempted_count,
                "unattempted_count": record.unattempted_count,
                "total_marks": float(record.total_marks),
                "obtained_marks": float(record.obtained_marks),
                "overall_grade": record.overall_grade,
                "is_auto_submitted": record.is_auto_submitted,
            },
            "summary": {
                "correct_count": correct_count,
                "incorrect_count": incorrect_count,
                "not_attempted_count": not_attempted_count,
                "total_marks_obtained": float(record.obtained_marks),
                "overall_percentage": round(
                    float(record.obtained_marks) / float(record.total_marks) * 100, 2
                ) if float(record.total_marks) > 0 else 0,
                "overall_grade": record.overall_grade,
            },
            "subject_results": ordered_subject_results,
            "grade_settings": grade_settings,
            "answers": detailed_answers,
        }
    finally:
        db.close()


def reset_user_today_attempt(user_id: int) -> dict:
    db = SessionLocal()
    try:
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

        record = (
            db.query(InterviewRecord)
            .filter(
                InterviewRecord.user_id == user_id,
                InterviewRecord.created_at >= today_start,
            )
            .order_by(desc(InterviewRecord.id))
            .first()
        )

        if record:
            db.delete(record)

        user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        if user_detail:
            user_detail.is_interview_submitted = False

        today = datetime.utcnow().date()
        assignment = (
            db.query(PaperAssignment)
            .filter(PaperAssignment.user_id == user_id, PaperAssignment.assigned_date == today)
            .first()
        )
        if assignment:
            assignment.is_attempted = False

        db.commit()
        return {"message": "User interview status has been reset and today's attempt removed."}
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def reset_user_details(user_id: int) -> dict:
    db = SessionLocal()
    try:
        user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        if user_detail:
            user_detail.is_submitted = False
            db.commit()
            return {"message": "User details submission status reset successfully."}
        raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="User details not found.")
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def reset_user_for_reinterview(user_id: int) -> dict:
    from datetime import date as dt_date
    db = SessionLocal()
    try:
        user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        if not user_detail:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="User details not found. Cannot enable re-interview.",
            )
        user_detail.is_submitted = False
        user_detail.is_interview_submitted = False
        user_detail.is_reinterview = True
        user_detail.reinterview_date = dt_date.today()
        db.commit()
        return {
            "message": "Re-interview enabled. User will appear in Today's Papers as RETURNING.",
            "reinterview_date": str(dt_date.today()),
        }
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def assign_manual_marks(user_id: int, record_id: int, question_id: int, marks: float) -> dict:
    db = SessionLocal()
    try:
        record = _get_record_or_404(db, record_id, user_id)

        # Validate question type
        question = db.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Question not found")

        if question.question_type in ["MULTIPLE_CHOICE", "IMAGE_MULTIPLE_CHOICE"]:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Cannot assign manual marks to auto-graded questions.",
            )

        max_marks = float(question.marks or 0)
        if marks < 0 or marks > max_marks:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail=f"Marks must be between 0 and {max_marks}",
            )

        # Update manual_marks in responses JSON
        responses: list[dict] = list(record.responses or [])
        found = False
        for resp in responses:
            if resp.get("question_id") == question_id:
                resp["manual_marks"] = marks
                found = True
                break

        if not found:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Response not found for this question")

        record.responses = responses
        flag_modified(record, "responses")

        # Recompute all grades in one shot
        _recompute_grades(record, db)

        db.commit()

        return {
            "message": "Manual marks applied successfully",
            "manual_marks": marks,
            "new_obtained_marks": float(record.obtained_marks),
            "new_overall_grade": record.overall_grade,
        }
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def reset_subject_responses(user_id: int, record_id: int, section_names: list[str]) -> dict:
    db = SessionLocal()
    try:
        record = (
            db.query(InterviewRecord)
            .filter(InterviewRecord.id == record_id, InterviewRecord.user_id == user_id)
            .first()
        )
        if not record:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Attempt not found")

        # Filter out responses for reset sections
        reset_sections = {_normalize_text(name) for name in section_names if name and name.strip()}
        if not reset_sections:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Please select at least one subject to reset",
            )

        existing = list(record.responses or [])
        filtered = [
            r
            for r in existing
            if _normalize_text(str(r.get("section_name") or "")) not in reset_sections
            and _normalize_text(str(r.get("section_code") or "")) not in reset_sections
        ]

        removed_count = len(existing) - len(filtered)
        if removed_count == 0:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="No saved responses were found for the selected subjects. Please refresh and try again.",
            )

        record.responses = filtered
        flag_modified(record, "responses")

        # Reset attempt status
        record.started_at = datetime.now(timezone.utc)
        record.status = "started"
        record.submitted_at = None
        record.completion_reason = None
        record.is_auto_submitted = False
        record.overall_grade = "N/A"
        record.subject_grades = []
        flag_modified(record, "subject_grades")

        # Recount
        paper = _get_paper_or_404(db, record.paper_id)
        record.total_questions = len(_extract_question_ids(paper.question_id))
        attempted_count = sum(1 for r in filtered if r.get("is_attempted"))
        record.attempted_count = attempted_count
        record.unattempted_count = max(record.total_questions - attempted_count, 0)

        # Reset UserDetail + PaperAssignment
        user_detail = db.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        if user_detail:
            user_detail.is_interview_submitted = False

        today = datetime.utcnow().date()
        assignment = (
            db.query(PaperAssignment)
            .filter(PaperAssignment.user_id == user_id, PaperAssignment.assigned_date == today)
            .first()
        )
        if assignment:
            assignment.is_attempted = False

        db.commit()
        return {
            "message": f"Successfully reset {len(reset_sections)} subjects",
            "removed_responses": removed_count,
        }
    except HTTPException:
        raise
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def mark_subject_section_as_skipped(user_id: int, record_id: int, section_name: str) -> dict:
    db = SessionLocal()
    try:
        record = _get_record_or_404(db, record_id, user_id)
        paper = _get_paper_or_404(db, record.paper_id)
        question_ids = _extract_question_ids(paper.question_id)

        # Get all questions in this section
        all_questions = (
            db.query(Question).filter(Question.id.in_(question_ids)).all()
            if question_ids else []
        )
        section_question_ids: list[int] = []
        for q in all_questions:
            _, s_name = _resolve_question_section(db, q)
            if s_name == section_name:
                section_question_ids.append(q.id)

        if not section_question_ids:
            return {"message": "No questions found for this section"}

        existing = list(record.responses or [])
        responded_ids = {r["question_id"] for r in existing}
        now = datetime.utcnow().isoformat()

        new_entries: list[dict] = []
        for qid in section_question_ids:
            if qid not in responded_ids:
                q = next((x for x in all_questions if x.id == qid), None)
                if not q:
                    continue
                s_code, s_nm = _resolve_question_section(db, q)
                new_entries.append({
                    "question_id": qid,
                    "section_code": s_code,
                    "section_name": s_nm,
                    "answer_text": None,
                    "is_attempted": False,
                    "is_auto_saved": True,
                    "is_skipped": True,
                    "manual_marks": None,
                    "saved_at": now,
                })

        if new_entries:
            record.responses = existing + new_entries
            flag_modified(record, "responses")
            db.commit()

        return {"message": f"Section {section_name} marked as skipped", "count": len(new_entries)}
    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


def get_active_attempt_status(user_id: int) -> dict:
    db = SessionLocal()
    try:
        today = datetime.utcnow().date()
        record = (
            db.query(InterviewRecord)
            .filter(
                InterviewRecord.user_id == user_id,
                func.date(InterviewRecord.created_at) == today,
            )
            .order_by(desc(InterviewRecord.id))
            .first()
        )

        if not record:
            return {"has_attempt": False, "status": None, "is_expired": False}

        is_expired = False
        if record.status == "started":
            paper = _get_paper_or_404(db, record.paper_id)
            total_dur = _get_total_duration_minutes(paper)
            if total_dur > 0:
                expiry = record.started_at + timedelta(minutes=total_dur)
                is_expired = datetime.utcnow() > expiry

        return {
            "has_attempt": True,
            "status": record.status,
            "is_expired": is_expired,
            "attempt_id": record.id,
        }
    finally:
        db.close()
