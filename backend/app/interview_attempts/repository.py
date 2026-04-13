from __future__ import annotations

from datetime import datetime
import json
import re
import math
from typing import Any

from fastapi import HTTPException
from sqlalchemy import desc, func

from app.classifications.models import Classification
from app.database.db import SessionLocal
from app.papers.models import Paper
from app.paper_assignments.models import PaperAssignment
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.users.models import User
from app.utils.status_codes import StatusCode
from app.user_details.models import UserDetail
from .models import InterviewAttempt, InterviewAttemptResponse


ACTIVE_ATTEMPT_STATUSES = {"started"}


def _normalize_text(value: str) -> str:
    return " ".join(value.strip().lower().split())


def _extract_option_key(value: str) -> str | None:
    """
    Extract leading option key from strings like:
    "A", "A.", "A: foo", "B) option text"
    """
    match = re.match(r"^\s*([a-z0-9]+)\s*[\.\):\-]?",
                     value.strip(), flags=re.I)
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

    # Direct normalized text match.
    if normalized_user == normalized_correct:
        return True

    # Option-key based comparison (for objective answers).
    user_parts = _split_answer_values(user_answer)
    correct_parts = _split_answer_values(correct_answer)

    user_keys = {
        _extract_option_key(part) or _normalize_text(part) for part in user_parts
    }
    correct_keys = {
        _extract_option_key(part) or _normalize_text(part) for part in correct_parts
    }

    return user_keys == correct_keys


def _extract_question_ids(question_payload: Any) -> list[int]:
    """Extract unique integer question ids from papers.question_id JSONB payload."""
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

    # Keep order but remove duplicates.
    deduped = list(dict.fromkeys(ids))
    return deduped


def _get_attempt_or_404(db_session, attempt_id: int, user_id: int) -> InterviewAttempt:
    attempt = (
        db_session.query(InterviewAttempt)
        .filter(
            InterviewAttempt.id == attempt_id,
            InterviewAttempt.user_id == user_id,
        )
        .first()
    )
    if not attempt:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail="Attempt not found",
        )
    return attempt


def _get_paper_or_404(db_session, paper_id: int) -> Paper:
    paper = db_session.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=f"Paper {paper_id} not found",
        )
    return paper


def _get_attempt_paper_question_ids(
    db_session, attempt: InterviewAttempt
) -> list[int]:
    paper = _get_paper_or_404(db_session, attempt.paper_id)
    return _extract_question_ids(paper.question_id)


def _resolve_question_section(
    db_session, question: Question
) -> tuple[str, str]:
    default_code = (question.subject_type or "").strip() or "GENERAL"
    classification = (
        db_session.query(Classification)
        .filter(
            Classification.code == default_code,
            Classification.type == "subject",
        )
        .first()
    )

    if classification:
        return classification.code, classification.name

    formatted_name = default_code.replace("_", " ").title()
    return default_code, formatted_name


def _serialize_saved_responses(
    db_session, attempt_id: int
) -> list[dict[str, Any]]:
    response_rows = (
        db_session.query(InterviewAttemptResponse)
        .filter(InterviewAttemptResponse.attempt_id == attempt_id)
        .order_by(InterviewAttemptResponse.id.asc())
        .all()
    )

    return [
        {
            "question_id": row.question_id,
            "section_code": row.section_code,
            "section_name": row.section_name,
            "answer_text": row.answer_text,
            "is_attempted": row.is_attempted,
            "is_auto_saved": row.is_auto_saved,
            "saved_at": row.saved_at,
        }
        for row in response_rows
    ]


def start_attempt(paper_id: int, user_id: int) -> dict:
    db_session = SessionLocal()
    try:
        paper = _get_paper_or_404(db_session, paper_id)
        question_ids = _extract_question_ids(paper.question_id)

        existing_attempt = (
            db_session.query(InterviewAttempt)
            .filter(
                InterviewAttempt.paper_id == paper_id,
                InterviewAttempt.user_id == user_id,
                InterviewAttempt.status.in_(ACTIVE_ATTEMPT_STATUSES),
            )
            .order_by(desc(InterviewAttempt.id))
            .first()
        )

        if existing_attempt:
            saved_responses = _serialize_saved_responses(
                db_session, existing_attempt.id)
            return {
                "attempt_id": existing_attempt.id,
                "paper_id": existing_attempt.paper_id,
                "user_id": existing_attempt.user_id,
                "status": existing_attempt.status,
                "total_questions": existing_attempt.total_questions,
                "started_at": existing_attempt.started_at,
                "is_resumed": True,
                "paper_question_ids": question_ids,
                "saved_responses": saved_responses,
            }

        attempt = InterviewAttempt(
            paper_id=paper_id,
            user_id=user_id,
            status="started",
            total_questions=len(question_ids),
            attempted_count=0,
            unattempted_count=len(question_ids),
            is_auto_submitted=False,
        )

        db_session.add(attempt)
        db_session.commit()
        db_session.refresh(attempt)

        return {
            "attempt_id": attempt.id,
            "paper_id": attempt.paper_id,
            "user_id": attempt.user_id,
            "status": attempt.status,
            "total_questions": attempt.total_questions,
            "started_at": attempt.started_at,
            "is_resumed": False,
            "paper_question_ids": question_ids,
            "saved_responses": [],
        }

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def save_answer(
    attempt_id: int,
    question_id: int,
    user_id: int,
    answer_text: str | None,
    is_auto_saved: bool,
) -> dict:
    db_session = SessionLocal()
    try:
        attempt = _get_attempt_or_404(db_session, attempt_id, user_id)
        paper_question_ids = set(
            _get_attempt_paper_question_ids(db_session, attempt))

        if attempt.status != "started":
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Cannot save answer. Attempt is already submitted.",
            )

        question = db_session.query(Question).filter(
            Question.id == question_id).first()
        if not question:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"Question {question_id} not found",
            )

        if question_id not in paper_question_ids:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Question does not belong to the paper for this attempt.",
            )

        normalized_text = (answer_text or "").strip()
        is_attempted = bool(normalized_text)
        section_code, section_name = _resolve_question_section(
            db_session, question)

        attempt_response = (
            db_session.query(InterviewAttemptResponse)
            .filter(
                InterviewAttemptResponse.attempt_id == attempt_id,
                InterviewAttemptResponse.question_id == question_id,
            )
            .first()
        )

        now = datetime.utcnow()

        if attempt_response:
            attempt_response.section_code = section_code
            attempt_response.section_name = section_name
            attempt_response.answer_text = normalized_text or None
            attempt_response.is_attempted = is_attempted
            attempt_response.is_auto_saved = is_auto_saved
            attempt_response.saved_at = now
            attempt_response.updated_at = now
        else:
            attempt_response = InterviewAttemptResponse(
                attempt_id=attempt_id,
                section_code=section_code,
                section_name=section_name,
                question_id=question_id,
                answer_text=normalized_text or None,
                is_attempted=is_attempted,
                is_auto_saved=is_auto_saved,
                saved_at=now,
            )
            db_session.add(attempt_response)

        db_session.flush()

        attempted_count = (
            db_session.query(InterviewAttemptResponse)
            .filter(
                InterviewAttemptResponse.attempt_id == attempt_id,
                InterviewAttemptResponse.is_attempted.is_(True),
            )
            .count()
        )

        attempt.attempted_count = attempted_count
        attempt.unattempted_count = max(
            attempt.total_questions - attempted_count, 0)

        db_session.commit()
        db_session.refresh(attempt_response)

        return {
            "attempt_id": attempt_id,
            "question_id": question_id,
            "section_code": attempt_response.section_code,
            "section_name": attempt_response.section_name,
            "is_attempted": attempt_response.is_attempted,
            "is_auto_saved": attempt_response.is_auto_saved,
            "saved_at": attempt_response.saved_at,
        }

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def _materialize_unanswered_rows(
    db_session, attempt: InterviewAttempt, is_auto_saved: bool
) -> None:
    paper = _get_paper_or_404(db_session, attempt.paper_id)
    question_ids = _extract_question_ids(paper.question_id)
    attempt.total_questions = len(question_ids)

    questions = (
        db_session.query(Question)
        .filter(Question.id.in_(question_ids))
        .all()
        if question_ids
        else []
    )
    questions_by_id = {question.id: question for question in questions}

    answered_ids = {
        row.question_id
        for row in db_session.query(InterviewAttemptResponse)
        .filter(InterviewAttemptResponse.attempt_id == attempt.id)
        .all()
    }

    missing_question_ids = [
        qid for qid in question_ids if qid not in answered_ids]
    now = datetime.utcnow()

    if missing_question_ids:
        missing_rows = []
        for qid in missing_question_ids:
            question = questions_by_id.get(qid)
            if not question:
                continue
            section_code, section_name = _resolve_question_section(
                db_session, question)
            missing_rows.append(
                InterviewAttemptResponse(
                    attempt_id=attempt.id,
                    section_code=section_code,
                    section_name=section_name,
                    question_id=qid,
                    answer_text=None,
                    is_attempted=False,
                    is_auto_saved=is_auto_saved,
                    saved_at=now,
                )
            )
        db_session.add_all(missing_rows)
        db_session.flush()


def finalize_attempt(
    attempt_id: int,
    user_id: int,
    status: str,
    completion_reason: str,
    is_auto_submitted: bool,
) -> dict:
    db_session = SessionLocal()
    try:
        attempt = _get_attempt_or_404(db_session, attempt_id, user_id)

        if attempt.status != "started":
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Attempt is already finalized.",
            )

        _materialize_unanswered_rows(
            db_session=db_session,
            attempt=attempt,
            is_auto_saved=is_auto_submitted,
        )

        attempted_count = (
            db_session.query(InterviewAttemptResponse)
            .filter(
                InterviewAttemptResponse.attempt_id == attempt.id,
                InterviewAttemptResponse.is_attempted.is_(True),
            )
            .count()
        )

        attempt.attempted_count = attempted_count
        attempt.unattempted_count = max(
            attempt.total_questions - attempted_count, 0)
        attempt.status = status
        attempt.completion_reason = completion_reason
        attempt.is_auto_submitted = is_auto_submitted
        attempt.submitted_at = datetime.utcnow()

        # Capture grade settings snapshot
        paper_obj = _get_paper_or_404(db_session, attempt.paper_id)
        if paper_obj:
            attempt.grade_settings_snapshot = paper_obj.grade_settings

        # Update UserDetail flag
        user_detail = db_session.query(UserDetail).filter(
            UserDetail.user_id == user_id).first()
        if user_detail:
            user_detail.is_interview_submitted = True

        # Update PaperAssignment status
        today = datetime.utcnow().date()
        assignment = (
            db_session.query(PaperAssignment)
            .filter(
                PaperAssignment.user_id == user_id,
                PaperAssignment.assigned_date == today
            )
            .first()
        )
        if assignment:
            assignment.is_attempted = True

        db_session.commit()
        db_session.refresh(attempt)

        return {
            "attempt_id": attempt.id,
            "paper_id": attempt.paper_id,
            "user_id": attempt.user_id,
            "status": attempt.status,
            "completion_reason": attempt.completion_reason,
            "started_at": attempt.started_at,
            "submitted_at": attempt.submitted_at,
            "total_questions": attempt.total_questions,
            "attempted_count": attempt.attempted_count,
            "unattempted_count": attempt.unattempted_count,
            "obtained_marks": float(attempt.obtained_marks)
            if attempt.obtained_marks is not None
            else None,
            "is_auto_submitted": attempt.is_auto_submitted,
        }

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def get_attempt_summary(attempt_id: int, user_id: int) -> dict:
    db_session = SessionLocal()
    try:
        attempt = _get_attempt_or_404(db_session, attempt_id, user_id)

        return {
            "attempt_id": attempt.id,
            "paper_id": attempt.paper_id,
            "user_id": attempt.user_id,
            "status": attempt.status,
            "completion_reason": attempt.completion_reason,
            "started_at": attempt.started_at,
            "submitted_at": attempt.submitted_at,
            "total_questions": attempt.total_questions,
            "attempted_count": attempt.attempted_count,
            "unattempted_count": attempt.unattempted_count,
            "obtained_marks": float(attempt.obtained_marks)
            if attempt.obtained_marks is not None
            else None,
            "is_auto_submitted": attempt.is_auto_submitted,
        }

    finally:
        db_session.close()



def get_admin_user_results(
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
    page: int = 1,
    limit: int = 10,
) -> dict:
    db_session = SessionLocal()
    try:
        users_query = db_session.query(User).filter(User.role == "user")
        if search:
            pattern = f"%{search.strip()}%"
            users_query = users_query.filter(
                (User.username.ilike(pattern))
                | (User.mobile.ilike(pattern))
                | (User.email.ilike(pattern))
            )

        if start_date or end_date:
            attempt_query = db_session.query(InterviewAttempt.user_id)
            if start_date:
                attempt_query = attempt_query.filter(InterviewAttempt.started_at >= f"{start_date} 00:00:00")
            if end_date:
                attempt_query = attempt_query.filter(InterviewAttempt.started_at <= f"{end_date} 23:59:59")
            
            users_query = users_query.filter(User.id.in_(attempt_query))

        total_items = users_query.count()
        total_pages = math.ceil(total_items / limit) if limit > 0 else 0

        users = (
            users_query.order_by(User.id.desc())
            .limit(limit)
            .offset((page - 1) * limit)
            .all()
        )
        
        results: list[dict] = []

        for user in users:
            # Latest attempt with paper and total_marks calculation
            latest_attempt_info = (
                db_session.query(InterviewAttempt, Paper.paper_name, Paper.grade_settings)
                .join(Paper, Paper.id == InterviewAttempt.paper_id)
                .filter(InterviewAttempt.user_id == user.id)
                .order_by(desc(InterviewAttempt.id))
                .first()
            )
            
            latest_attempt = latest_attempt_info[0] if latest_attempt_info else None
            paper_name = latest_attempt_info[1] if latest_attempt_info else None
            
            # Use snapshot if available, else fallback to current paper settings
            if latest_attempt and latest_attempt.grade_settings_snapshot is not None:
                grade_settings = latest_attempt.grade_settings_snapshot
            else:
                grade_settings = latest_attempt_info[2] if latest_attempt_info and latest_attempt_info[2] else []
            
            attempts_count = (
                db_session.query(InterviewAttempt)
                .filter(InterviewAttempt.user_id == user.id)
                .count()
            )

            # Calculate total_marks and typing_stats for latest attempt
            total_marks = 0.0
            typing_stats = None
            subject_results = []
            
            if latest_attempt:
                # Total Marks
                paper_obj = db_session.query(Paper).filter(Paper.id == latest_attempt.paper_id).first()
                if paper_obj:
                    q_ids = _extract_question_ids(paper_obj.question_id)
                    total_marks = db_session.query(func.sum(Question.marks)).filter(Question.id.in_(q_ids)).scalar() or 0.0

                # Typing stats and subject grades (requires full detail calculation for accuracy)
                # To keep list view relatively fast, we perform a mini-calculation here
                responses = (
                    db_session.query(InterviewAttemptResponse, Question, QuestionAnswer)
                    .join(Question, Question.id == InterviewAttemptResponse.question_id)
                    .outerjoin(QuestionAnswer, QuestionAnswer.question_id == Question.id)
                    .filter(InterviewAttemptResponse.attempt_id == latest_attempt.id)
                    .all()
                )
                
                subject_stats = {}
                for resp, ques, corr in responses:
                    # Typing
                    if ques.question_type == "TYPING_TEST" and resp.answer_text and resp.answer_text.startswith("{"):
                        try:
                            parsed = json.loads(resp.answer_text)
                            typing_stats = parsed.get("stats")
                        except Exception:
                            pass
                    
                    # Subject Stats
                    s_name = resp.section_name
                    if s_name not in subject_stats:
                        subject_stats[s_name] = {"max": 0.0, "obtained": 0.0}
                    
                    ques_marks = float(ques.marks or 0)
                    subject_stats[s_name]["max"] += ques_marks
                    
                    if resp.is_attempted:
                        if resp.manual_marks is not None:
                            subject_stats[s_name]["obtained"] += float(resp.manual_marks)
                        else:
                            corr_text = corr.answer_text if corr else ""
                            if _is_answer_correct(resp.answer_text or "", corr_text):
                                subject_stats[s_name]["obtained"] += ques_marks
                
                # Format subjects
                for s_name, stats in subject_stats.items():
                    perc = (stats["obtained"] / stats["max"] * 100) if stats["max"] > 0 else 0
                    grade = "N/A"
                    for gs in grade_settings:
                        if gs.get("min", 0) <= perc <= gs.get("max", 100):
                            grade = gs.get("grade_label", "N/A")
                            break
                    subject_results.append({
                        "section_name": s_name,
                        "grade": grade,
                        "obtained": stats["obtained"],
                        "max": stats["max"]
                    })

            results.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "mobile": user.mobile,
                    "email": user.email,
                    "attempts_count": attempts_count,
                    "is_reattempt": attempts_count > 1,
                    "latest_attempt": {
                        "attempt_id": latest_attempt.id,
                        "paper_id": latest_attempt.paper_id,
                        "paper_name": paper_name,
                        "status": latest_attempt.status,
                        "completion_reason": latest_attempt.completion_reason,
                        "submitted_at": latest_attempt.submitted_at,
                        "total_questions": latest_attempt.total_questions,
                        "attempted_count": latest_attempt.attempted_count,
                        "unattempted_count": latest_attempt.unattempted_count,
                        "obtained_marks": float(latest_attempt.obtained_marks)
                        if latest_attempt.obtained_marks is not None
                        else None,
                        "total_marks": float(total_marks),
                        "typing_stats": typing_stats,
                        "subject_results": subject_results
                    }
                    if latest_attempt
                    else None,
                }
            )

        return {
            "items": results,
            "total": total_items,
            "page": page,
            "limit": limit,
            "total_pages": total_pages,
        }
    finally:
        db_session.close()


def get_admin_user_attempts(user_id: int) -> dict:
    db_session = SessionLocal()
    try:
        user = (
            db_session.query(User)
            .filter(User.id == user_id, User.role == "user")
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"User {user_id} not found",
            )

        attempts_with_papers = (
            db_session.query(InterviewAttempt, Paper.paper_name)
            .join(Paper, Paper.id == InterviewAttempt.paper_id)
            .filter(InterviewAttempt.user_id == user_id)
            .order_by(desc(InterviewAttempt.id))
            .all()
        )

        attempt_ids = [a[0].id for a in attempts_with_papers]

        # Fetch typing test stats for summary
        typing_responses = (
            db_session.query(InterviewAttemptResponse)
            .join(Question, Question.id == InterviewAttemptResponse.question_id)
            .filter(
                InterviewAttemptResponse.attempt_id.in_(attempt_ids),
                Question.question_type == "TYPING_TEST",
                InterviewAttemptResponse.is_attempted.is_(True),
            )
            .all()
        )
        typing_stats_map = {}
        for row in typing_responses:
            if not row.answer_text or not row.answer_text.startswith("{"):
                continue
            try:
                parsed = json.loads(row.answer_text)
                typing_stats_map[row.attempt_id] = parsed.get("stats")
            except Exception:
                continue

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
            },
            "attempts": [
                {
                    "attempt_id": attempt.id,
                    "paper_id": attempt.paper_id,
                    "paper_name": paper_name,
                    "status": attempt.status,
                    "completion_reason": attempt.completion_reason,
                    "started_at": attempt.started_at,
                    "submitted_at": attempt.submitted_at,
                    "total_questions": attempt.total_questions,
                    "attempted_count": attempt.attempted_count,
                    "unattempted_count": attempt.unattempted_count,
                    "obtained_marks": float(attempt.obtained_marks)
                    if attempt.obtained_marks is not None
                    else None,
                    "is_auto_submitted": attempt.is_auto_submitted,
                    "typing_stats": typing_stats_map.get(attempt.id),
                }
                for attempt, paper_name in attempts_with_papers
            ],
        }
    finally:
        db_session.close()


def get_admin_user_result_detail(user_id: int, attempt_id: int | None = None) -> dict:
    db_session = SessionLocal()
    try:
        user = (
            db_session.query(User)
            .filter(User.id == user_id, User.role == "user")
            .first()
        )
        if not user:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"User {user_id} not found",
            )

        attempt_query = db_session.query(InterviewAttempt).filter(
            InterviewAttempt.user_id == user_id
        )
        if attempt_id is not None:
            attempt_query = attempt_query.filter(
                InterviewAttempt.id == attempt_id)

        attempt = attempt_query.order_by(desc(InterviewAttempt.id)).first()
        if not attempt:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="No interview attempt found for this user",
            )

        paper_obj = db_session.query(Paper).filter(Paper.id == attempt.paper_id).first()
        if attempt.grade_settings_snapshot is not None:
            grade_settings = attempt.grade_settings_snapshot
        else:
            grade_settings = paper_obj.grade_settings if paper_obj and paper_obj.grade_settings else []

        # Current attempt number for this user
        attempt_number = (
            db_session.query(InterviewAttempt)
            .filter(
                InterviewAttempt.user_id == user_id,
                InterviewAttempt.id <= attempt.id
            )
            .count()
        )

        answer_rows = (
            db_session.query(InterviewAttemptResponse,
                             Question, QuestionAnswer)
            .join(Question, Question.id == InterviewAttemptResponse.question_id)
            .outerjoin(QuestionAnswer, QuestionAnswer.question_id == Question.id)
            .filter(InterviewAttemptResponse.attempt_id == attempt.id)
            .order_by(InterviewAttemptResponse.id.asc())
            .all()
        )

        detailed_answers: list[dict] = []
        subject_stats: dict[str, dict[str, Any]] = {}
        correct_count = 0
        incorrect_count = 0
        not_attempted_count = 0
        total_marks_obtained = 0.0
        total_max_marks = 0.0

        for answer_row, question, correct_answer in answer_rows:
            correct_answer_text = (
                correct_answer.answer_text if correct_answer else None
            ) or ""
            user_answer_text = (answer_row.answer_text or "").strip()
            is_attempted = bool(answer_row.is_attempted)
            is_correct = False

            if not is_attempted:
                status = "not_attempted"
                not_attempted_count += 1
                marks_obtained = 0.0
            else:
                if answer_row.manual_marks is not None:
                    marks_obtained = float(answer_row.manual_marks)
                    is_correct = marks_obtained > 0
                    status = "correct" if is_correct else "incorrect"
                    if is_correct:
                        correct_count += 1
                    else:
                        incorrect_count += 1
                else:
                    if correct_answer_text.strip():
                        is_correct = _is_answer_correct(
                            user_answer=user_answer_text,
                            correct_answer=correct_answer_text,
                        )
                    status = "correct" if is_correct else "incorrect"
                    if is_correct:
                        correct_count += 1
                    else:
                        incorrect_count += 1
                    marks_obtained = float(
                        question.marks or 0) if is_correct else 0.0

            total_marks_obtained += marks_obtained
            total_max_marks += float(question.marks or 0)

            # Enhanced parsing for special types like Typing Test
            user_answer_display = answer_row.answer_text
            typing_stats = None

            if question.question_type == "TYPING_TEST" and user_answer_text.startswith("{"):
                try:
                    parsed = json.loads(user_answer_text)
                    user_answer_display = parsed.get(
                        "typed_text", user_answer_text)
                    typing_stats = parsed.get("stats")
                except Exception:
                    pass

            detailed_answers.append(
                {
                    "question_id": question.id,
                    "section_code": answer_row.section_code,
                    "section_name": answer_row.section_name,
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
                    "status": status,
                    "marks_obtained": marks_obtained,
                    "manual_marks": float(answer_row.manual_marks) if answer_row.manual_marks is not None else None,
                    "is_attempted": answer_row.is_attempted,
                    "is_auto_saved": answer_row.is_auto_saved,
                    "saved_at": answer_row.saved_at,
                }
            )
            # Track subject-wise stats
            section_name = answer_row.section_name
            if section_name not in subject_stats:
                subject_stats[section_name] = {
                    "total_questions": 0,
                    "attempted_count": 0,
                    "unattempted_count": 0,
                    "correct_count": 0,
                    "incorrect_count": 0,
                    "obtained_marks": 0.0,
                    "max_marks": 0.0,
                }
            
            stats = subject_stats[section_name]
            stats["total_questions"] += 1
            stats["max_marks"] += float(question.marks or 0)
            
            if is_attempted:
                stats["attempted_count"] += 1
                stats["obtained_marks"] += marks_obtained
                if status == "correct":
                    stats["correct_count"] += 1
                else:
                    stats["incorrect_count"] += 1
            else:
                stats["unattempted_count"] += 1

        # Calculate subject-wise grades
        subject_wise_result = []
        for section_name, stats in subject_stats.items():
            percentage = (stats["obtained_marks"] / stats["max_marks"] * 100) if stats["max_marks"] > 0 else 0
            
            grade_label = "N/A"
            for setting in grade_settings:
                # Support both inclusive and exclusive ranges if needed, but here we do standard check
                if setting.get("min", 0) <= percentage <= setting.get("max", 100):
                    grade_label = setting.get("grade_label", "N/A")
                    break
            
            subject_wise_result.append({
                "section_name": section_name,
                "total_questions": stats["total_questions"],
                "attempted_count": stats["attempted_count"],
                "unattempted_count": stats["unattempted_count"],
                "correct_count": stats["correct_count"],
                "incorrect_count": stats["incorrect_count"],
                "obtained_marks": stats["obtained_marks"],
                "max_marks": stats["max_marks"],
                "percentage": round(percentage, 2),
                "grade": grade_label
            })
            
        overall_percentage = (total_marks_obtained / total_max_marks * 100) if total_max_marks > 0 else 0
        overall_grade = "N/A"
        for setting in grade_settings:
            if setting.get("min", 0) <= overall_percentage <= setting.get("max", 100):
                overall_grade = setting.get("grade_label", "N/A")
                break

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
            },
            "attempt": {
                "attempt_id": attempt.id,
                "paper_id": attempt.paper_id,
                "paper_name": paper_obj.paper_name if paper_obj else "Unknown Paper",
                "attempt_number": attempt_number,
                "status": attempt.status,
                "completion_reason": attempt.completion_reason,
                "started_at": attempt.started_at,
                "submitted_at": attempt.submitted_at,
                "total_questions": attempt.total_questions,
                "attempted_count": attempt.attempted_count,
                "unattempted_count": attempt.unattempted_count,
                "obtained_marks": float(attempt.obtained_marks)
                if attempt.obtained_marks is not None
                else None,
                "is_auto_submitted": attempt.is_auto_submitted,
            },
            "summary": {
                "correct_count": correct_count,
                "incorrect_count": incorrect_count,
                "not_attempted_count": not_attempted_count,
                "total_marks_obtained": total_marks_obtained,
                "overall_percentage": round(overall_percentage, 2),
                "overall_grade": overall_grade,
            },
            "subject_wise_result": subject_wise_result,
            "grade_settings": grade_settings,
            "answers": detailed_answers,
        }
    finally:
        db_session.close()


def reset_user_today_attempt(user_id: int) -> dict:
    db_session = SessionLocal()
    try:
        # Find latest attempt created today (UTC)
        today_start = datetime.utcnow().replace(
            hour=0, minute=0, second=0, microsecond=0
        )

        attempt = (
            db_session.query(InterviewAttempt)
            .filter(
                InterviewAttempt.user_id == user_id,
                InterviewAttempt.created_at >= today_start,
            )
            .order_by(desc(InterviewAttempt.id))
            .first()
        )

        if attempt:
            # Delete responses first (cascade might handle it but let's be explicit)
            db_session.query(InterviewAttemptResponse).filter(
                InterviewAttemptResponse.attempt_id == attempt.id
            ).delete()
            # Delete the attempt
            db_session.delete(attempt)

        # Reset UserDetail flag
        user_detail = (
            db_session.query(UserDetail).filter(
                UserDetail.user_id == user_id).first()
        )
        if user_detail:
            user_detail.is_interview_submitted = False

        # Reset PaperAssignment status
        today = datetime.utcnow().date()
        assignment = (
            db_session.query(PaperAssignment)
            .filter(
                PaperAssignment.user_id == user_id,
                PaperAssignment.assigned_date == today
            )
            .first()
        )
        if assignment:
            assignment.is_attempted = False

        db_session.commit()
        return {
            "message": "User interview status has been reset and today's attempt removed."
        }
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def reset_user_details(user_id: int) -> dict:
    db_session = SessionLocal()
    try:
        user_detail = (
            db_session.query(UserDetail).filter(
                UserDetail.user_id == user_id).first()
        )
        if user_detail:
            user_detail.is_submitted = False
            db_session.commit()
            return {"message": "User details submission status reset successfully."}
        else:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="User details not found."
            )
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def reset_user_for_reinterview(user_id: int) -> dict:
    """
    Existing user ko dobara interview ke liye enable karta hai.
    - is_submitted = False  (user form phir se fill kar sake)
    - is_interview_submitted = False  (user interview phir de sake)
    - is_reinterview = True  (flag: yeh returning user hai)
    - reinterview_date = today  (Today's Papers me dikhega aaj)
    """
    from datetime import date as dt_date
    db_session = SessionLocal()
    try:
        user_detail = (
            db_session.query(UserDetail).filter(
                UserDetail.user_id == user_id).first()
        )
        if not user_detail:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="User details not found. Cannot enable re-interview."
            )

        user_detail.is_submitted = False
        user_detail.is_interview_submitted = False
        user_detail.is_reinterview = True
        user_detail.reinterview_date = dt_date.today()

        db_session.commit()
        return {
            "message": "Re-interview enabled. User will appear in Today's Papers as RETURNING.",
            "reinterview_date": str(dt_date.today()),
        }
    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def assign_manual_marks(user_id: int, attempt_id: int, question_id: int, marks: float) -> dict:
    db_session = SessionLocal()
    try:
        attempt = _get_attempt_or_404(db_session, attempt_id, user_id)

        answer_row = (
            db_session.query(InterviewAttemptResponse)
            .filter(
                InterviewAttemptResponse.attempt_id == attempt_id,
                InterviewAttemptResponse.question_id == question_id,
            )
            .first()
        )
        if not answer_row:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="Response not found",
            )
            
        question = db_session.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="Question not found")
            
        if question.question_type in ["MULTIPLE_CHOICE", "IMAGE_MULTIPLE_CHOICE"]:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST, 
                detail="Cannot assign manual marks to auto-graded questions."
            )
            
        max_marks = float(question.marks or 0)
        if marks < 0 or marks > max_marks:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST, 
                detail=f"Marks must be between 0 and {max_marks}"
            )

        answer_row.manual_marks = marks
        db_session.commit()
    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

    result_details = get_admin_user_result_detail(user_id=user_id, attempt_id=attempt_id)
    new_total = result_details["summary"]["total_marks_obtained"]

    update_db = SessionLocal()
    try:
        attempt = update_db.query(InterviewAttempt).filter(InterviewAttempt.id == attempt_id).first()
        if attempt:
            attempt.obtained_marks = new_total
            update_db.commit()
    except Exception as exception:
        update_db.rollback()
        raise exception
    finally:
        update_db.close()

    return {
        "message": "Manual marks applied successfully",
        "manual_marks": marks,
        "new_total_marks": new_total,
    }
