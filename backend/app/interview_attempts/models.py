from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    ForeignKey,
    Integer,
    Numeric,
    String,
    TIMESTAMP,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


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

    # Consolidated responses for all saved answers.
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
