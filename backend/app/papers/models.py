from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    TIMESTAMP,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from app.database.db import Base


class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    paper_name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    test_level_id = Column(Integer, ForeignKey("classifications.id"), nullable=False)
    subject_ids_data = Column(JSONB, nullable=False)
    question_id = Column(JSONB, nullable=False)
    total_time = Column(String(50), nullable=True)
    total_marks = Column(Integer, nullable=True)
    is_active = Column(Boolean, server_default="true", nullable=False)
    grade = Column(String(100), nullable=True)
    grade_settings = Column(JSONB, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(
        TIMESTAMP, server_default=func.current_timestamp(), nullable=False
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )


class PaperGradeSettingLog(Base):
    __tablename__ = "paper_grade_setting_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    paper_id = Column(Integer, ForeignKey("papers.id", ondelete="CASCADE"), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    old_grade_settings = Column(JSONB, nullable=True)
    new_grade_settings = Column(JSONB, nullable=True)
    updated_at = Column(
        TIMESTAMP, server_default=func.current_timestamp(), nullable=False
    )
