from sqlalchemy import (
    Column,
    Date,
    ForeignKey,
    Integer,
    TIMESTAMP,
    UniqueConstraint,
    func,
)

from app.database.db import Base


class PaperAssignment(Base):
    __tablename__ = "paper_assignments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    paper_id = Column(Integer, ForeignKey("papers.id"), nullable=False, index=True)
    assigned_date = Column(Date, nullable=False, index=True)
    assigned_by = Column(Integer, ForeignKey("users.id"), nullable=False)
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
