from __future__ import annotations

from datetime import datetime
from typing import Any

from fastapi import HTTPException
from sqlalchemy import desc

from app.database.db import SessionLocal
from app.papers.models import Paper
from app.questions.models import Question
from app.utils.status_codes import StatusCode
from .models import InterviewAttempt, InterviewAttemptAnswer


ACTIVE_ATTEMPT_STATUSES = {"started"}


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


def _materialize_unanswered_rows(db_session, attempt: InterviewAttempt, is_auto_saved: bool) -> None:
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
