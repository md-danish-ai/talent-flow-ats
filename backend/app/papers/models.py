from sqlalchemy import (
    Column,
    Integer,
    String,
    TIMESTAMP,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from app.database.db import Base


class Paper(Base):
    __tablename__ = "papers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    subject_id = Column(JSONB, nullable=False)
    question_id = Column(JSONB, nullable=False)
    
    duration = Column(JSONB, nullable=False)
    level = Column(String(100), nullable=False)
    weights = Column(JSONB, nullable=False)
    
    grade = Column(String(100), nullable=True)

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False
    )
