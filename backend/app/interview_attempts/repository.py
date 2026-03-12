from __future__ import annotations

from datetime import datetime
import re
from typing import Any

from fastapi import HTTPException
from sqlalchemy import desc

from app.database.db import SessionLocal
from app.papers.models import Paper
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.users.models import User
from app.utils.status_codes import StatusCode
from .models import InterviewAttempt, InterviewAttemptAnswer


ACTIVE_ATTEMPT_STATUSES = {"started"}


def _normalize_text(value: str) -> str:
    return " ".join(value.strip().lower().split())


def _extract_option_key(value: str) -> str | None:
    """
    Extract leading option key from strings like:
    "A", "A.", "A: foo", "B) option text"
    """
    match = re.match(r"^\s*([a-z0-9]+)\s*[\.\):\-]?", value.strip(), flags=re.I)
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


def start_attempt(paper_id: int, user_id: int) -> dict:
    db_session = SessionLocal()
    try:
        paper = db_session.query(Paper).filter(Paper.id == paper_id).first()
        if not paper:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"Paper {paper_id} not found",
            )

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
            return {
                "attempt_id": existing_attempt.id,
                "paper_id": existing_attempt.paper_id,
                "user_id": existing_attempt.user_id,
                "status": existing_attempt.status,
                "total_questions": existing_attempt.total_questions,
                "started_at": existing_attempt.started_at,
                "paper_question_ids": question_ids,
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
            "paper_question_ids": question_ids,
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

        if attempt.status != "started":
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail="Cannot save answer. Attempt is already submitted.",
            )

        question = db_session.query(Question).filter(Question.id == question_id).first()
        if not question:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"Question {question_id} not found",
            )

        normalized_text = (answer_text or "").strip()
        is_attempted = bool(normalized_text)

        attempt_answer = (
            db_session.query(InterviewAttemptAnswer)
            .filter(
                InterviewAttemptAnswer.attempt_id == attempt_id,
                InterviewAttemptAnswer.question_id == question_id,
            )
            .first()
        )

        now = datetime.utcnow()

        if attempt_answer:
            attempt_answer.answer_text = normalized_text or None
            attempt_answer.is_attempted = is_attempted
            attempt_answer.is_auto_saved = is_auto_saved
            attempt_answer.saved_at = now
            attempt_answer.updated_at = now
        else:
            attempt_answer = InterviewAttemptAnswer(
                attempt_id=attempt_id,
                question_id=question_id,
                answer_text=normalized_text or None,
                is_attempted=is_attempted,
                is_auto_saved=is_auto_saved,
                saved_at=now,
            )
            db_session.add(attempt_answer)

        db_session.flush()

        attempted_count = (
            db_session.query(InterviewAttemptAnswer)
            .filter(
                InterviewAttemptAnswer.attempt_id == attempt_id,
                InterviewAttemptAnswer.is_attempted.is_(True),
            )
            .count()
        )

        attempt.attempted_count = attempted_count
        attempt.unattempted_count = max(attempt.total_questions - attempted_count, 0)

        db_session.commit()
        db_session.refresh(attempt_answer)

        return {
            "attempt_id": attempt_id,
            "question_id": question_id,
            "is_attempted": attempt_answer.is_attempted,
            "is_auto_saved": attempt_answer.is_auto_saved,
            "saved_at": attempt_answer.saved_at,
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
    paper = db_session.query(Paper).filter(Paper.id == attempt.paper_id).first()
    if not paper:
        return

    question_ids = _extract_question_ids(paper.question_id)
    attempt.total_questions = len(question_ids)

    answered_ids = {
        row.question_id
        for row in db_session.query(InterviewAttemptAnswer)
        .filter(InterviewAttemptAnswer.attempt_id == attempt.id)
        .all()
    }

    missing_question_ids = [qid for qid in question_ids if qid not in answered_ids]
    now = datetime.utcnow()

    if missing_question_ids:
        missing_rows = [
            InterviewAttemptAnswer(
                attempt_id=attempt.id,
                question_id=qid,
                answer_text=None,
                is_attempted=False,
                is_auto_saved=is_auto_saved,
                saved_at=now,
            )
            for qid in missing_question_ids
        ]
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
            db_session.query(InterviewAttemptAnswer)
            .filter(
                InterviewAttemptAnswer.attempt_id == attempt.id,
                InterviewAttemptAnswer.is_attempted.is_(True),
            )
            .count()
        )

        attempt.attempted_count = attempted_count
        attempt.unattempted_count = max(attempt.total_questions - attempted_count, 0)
        attempt.status = status
        attempt.completion_reason = completion_reason
        attempt.is_auto_submitted = is_auto_submitted
        attempt.submitted_at = datetime.utcnow()

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


def get_admin_user_results(search: str | None = None) -> list[dict]:
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

        users = users_query.order_by(User.id.desc()).all()
        results: list[dict] = []

        for user in users:
            latest_attempt = (
                db_session.query(InterviewAttempt)
                .filter(InterviewAttempt.user_id == user.id)
                .order_by(desc(InterviewAttempt.id))
                .first()
            )
            attempts_count = (
                db_session.query(InterviewAttempt)
                .filter(InterviewAttempt.user_id == user.id)
                .count()
            )

            results.append(
                {
                    "user_id": user.id,
                    "username": user.username,
                    "mobile": user.mobile,
                    "email": user.email,
                    "attempts_count": attempts_count,
                    "latest_attempt": {
                        "attempt_id": latest_attempt.id,
                        "status": latest_attempt.status,
                        "completion_reason": latest_attempt.completion_reason,
                        "submitted_at": latest_attempt.submitted_at,
                        "total_questions": latest_attempt.total_questions,
                        "attempted_count": latest_attempt.attempted_count,
                        "unattempted_count": latest_attempt.unattempted_count,
                        "obtained_marks": float(latest_attempt.obtained_marks)
                        if latest_attempt.obtained_marks is not None
                        else None,
                    }
                    if latest_attempt
                    else None,
                }
            )

        return results
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

        attempts = (
            db_session.query(InterviewAttempt)
            .filter(InterviewAttempt.user_id == user_id)
            .order_by(desc(InterviewAttempt.id))
            .all()
        )

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
                for attempt in attempts
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
            attempt_query = attempt_query.filter(InterviewAttempt.id == attempt_id)

        attempt = attempt_query.order_by(desc(InterviewAttempt.id)).first()
        if not attempt:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail="No interview attempt found for this user",
            )

        answer_rows = (
            db_session.query(InterviewAttemptAnswer, Question, QuestionAnswer)
            .join(Question, Question.id == InterviewAttemptAnswer.question_id)
            .outerjoin(QuestionAnswer, QuestionAnswer.question_id == Question.id)
            .filter(InterviewAttemptAnswer.attempt_id == attempt.id)
            .order_by(InterviewAttemptAnswer.id.asc())
            .all()
        )

        detailed_answers: list[dict] = []
        correct_count = 0
        incorrect_count = 0
        not_attempted_count = 0
        total_marks_obtained = 0.0

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
                marks_obtained = float(question.marks or 0) if is_correct else 0.0

            total_marks_obtained += marks_obtained

            detailed_answers.append(
                {
                    "question_id": question.id,
                    "question_type": question.question_type,
                    "subject_type": question.subject_type,
                    "exam_level": question.exam_level,
                    "question_text": question.question_text,
                    "passage": question.passage,
                    "image_url": question.image_url,
                    "options": question.options,
                    "max_marks": float(question.marks or 0),
                    "user_answer": answer_row.answer_text,
                    "correct_answer": correct_answer_text or None,
                    "status": status,
                    "marks_obtained": marks_obtained,
                    "is_attempted": answer_row.is_attempted,
                    "is_auto_saved": answer_row.is_auto_saved,
                    "saved_at": answer_row.saved_at,
                }
            )

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
            },
            "answers": detailed_answers,
        }
    finally:
        db_session.close()
