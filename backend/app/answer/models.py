from sqlalchemy import (
    Column,
    Integer,
    Text,
    ForeignKey,
    TIMESTAMP,
    func,
)

from app.database.db import Base


class QuestionAnswer(Base):
    __tablename__ = "question_answers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(
        Integer,
        ForeignKey("questions.id"),
        unique=True,
        nullable=False
    )
    answer_text = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)

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
