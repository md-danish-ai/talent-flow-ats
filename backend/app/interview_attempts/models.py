from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    ForeignKey,
    Integer,
    Numeric,
    String,
    TIMESTAMP,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


# ─────────────────────────────────────────────────────────────────────────────
# Legacy models — kept for backward compat until old tables are dropped
# ─────────────────────────────────────────────────────────────────────────────

class InterviewAttempt(Base):
    __tablename__ = "interview_attempts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    status = Column(String(30), nullable=False, server_default="started")
    completion_reason = Column(String(30), nullable=True)

    started_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False,
    )
    submitted_at = Column(TIMESTAMP, nullable=True)

    total_questions = Column(Integer, nullable=False, server_default="0")
    attempted_count = Column(Integer, nullable=False, server_default="0")
    unattempted_count = Column(Integer, nullable=False, server_default="0")
    obtained_marks = Column(Numeric(10, 2), nullable=True)

    is_auto_submitted = Column(Boolean, nullable=False, server_default="false")
    grade_settings_snapshot = Column(JSONB, nullable=True)

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False,
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('started', 'submitted', 'auto_submitted', 'expired', 'system_error')",
            name="chk_interview_attempts_status",
        ),
        CheckConstraint(
            "completion_reason IN ('manual', 'time_over')",
            name="chk_interview_attempts_completion_reason",
        ),
    )


class InterviewAttemptResponse(Base):
    __tablename__ = "interview_attempt_responses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    attempt_id = Column(
        Integer,
        ForeignKey("interview_attempts.id", ondelete="CASCADE"),
        nullable=False,
    )
    section_code = Column(String(100), nullable=False)
    section_name = Column(String(255), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)

    answer_text = Column(Text, nullable=True)
    manual_marks = Column(Numeric(10, 2), nullable=True)
    is_attempted = Column(Boolean, nullable=False, server_default="false")
    is_auto_saved = Column(Boolean, nullable=False, server_default="false")

    saved_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False,
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False,
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "attempt_id",
            "question_id",
            name="uq_interview_attempt_responses_attempt_question",
        ),
    )


# ─────────────────────────────────────────────────────────────────────────────
# New consolidated model — interview_attempts + interview_attempt_responses
# ─────────────────────────────────────────────────────────────────────────────

class InterviewRecord(Base):
    __tablename__ = "interview_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Status
    status = Column(String(30), nullable=False, server_default="started")
    completion_reason = Column(String(30), nullable=True)

    # Timestamps
    started_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False,
    )
    submitted_at = Column(TIMESTAMP, nullable=True)

    # Question counts
    total_questions = Column(Integer, nullable=False, server_default="0")
    attempted_count = Column(Integer, nullable=False, server_default="0")
    unattempted_count = Column(Integer, nullable=False, server_default="0")

    # Marks — computed and stored at submit / manual-marks time
    total_marks = Column(Numeric(10, 2), nullable=False, server_default="0")
    obtained_marks = Column(Numeric(10, 2), nullable=False, server_default="0")

    # Grades — computed at submit time, permanently stored
    overall_grade = Column(String(20), nullable=False, server_default="N/A")
    subject_grades = Column(JSONB, nullable=False, server_default="[]")

    # Flags
    is_auto_submitted = Column(Boolean, nullable=False, server_default="false")

    # Consolidated responses (replaces interview_attempt_responses table)
    # Flat JSON array: [{question_id, section_code, section_name, answer_text,
    #                    is_attempted, is_auto_saved, is_skipped, manual_marks, saved_at}]
    responses = Column(JSONB, nullable=False, server_default="[]")

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False,
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('started', 'submitted', 'auto_submitted', 'expired', 'system_error')",
            name="chk_interview_records_status",
        ),
        CheckConstraint(
            "completion_reason IN ('manual', 'time_over')",
            name="chk_interview_records_completion_reason",
        ),
    )
