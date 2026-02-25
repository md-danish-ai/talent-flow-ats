from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    ForeignKey,
    TIMESTAMP,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB
from app.database.db import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    question_type = Column(String(100), nullable=False)
    subject_type = Column(String(100), nullable=False)
    exam_level = Column(String(100), nullable=False)

    question_text = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    passage = Column(Text, nullable=True)

    marks = Column(Integer, nullable=True)

    is_active = Column(Boolean, default=True)

    # JSONB instead of relationship
    options = Column(JSONB, nullable=True)

    created_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        nullable=False
    )

    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
        nullable=False
    )