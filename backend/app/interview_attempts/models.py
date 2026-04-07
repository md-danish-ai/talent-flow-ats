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

from app.database.db import Base


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
