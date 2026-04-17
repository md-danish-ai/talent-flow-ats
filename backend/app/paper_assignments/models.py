from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    TIMESTAMP,
    UniqueConstraint,
    func,
    Boolean,
    String,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


class PaperAssignment(Base):
    __tablename__ = "paper_assignments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False, index=True)
    test_level_id = Column(Integer, ForeignKey("classifications.id"), nullable=False, index=True)
    is_attempted = Column(Boolean, default=False, nullable=False)
    assigned_date = Column(Date, nullable=False, index=True)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Tracking fields
    assignment_source = Column(String(50), server_default="MANUAL", nullable=False)  # 'MANUAL' or 'AUTO'
    auto_rule_id = Column(Integer, ForeignKey("auto_assignment_rules.id"), nullable=True)

    created_at = Column(
        TIMESTAMP, server_default=func.current_timestamp(), nullable=False
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "assigned_date",
            name="uq_paper_assignments_user_date",
        ),
    )


class AutoAssignmentRule(Base):
    __tablename__ = "auto_assignment_rules"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False, index=True)
    test_level_id = Column(Integer, ForeignKey("classifications.id"), nullable=False, index=True)
    assigned_date = Column(Date, nullable=False, index=True)
    paper_ids = Column(JSONB, nullable=False)  # List of allowed Paper IDs
    is_active = Column(Boolean, server_default="true", nullable=False)
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

    __table_args__ = (
        UniqueConstraint(
            "department_id",
            "test_level_id",
            "assigned_date",
            name="uq_auto_assignment_rules_dept_level_date",
        ),
    )
