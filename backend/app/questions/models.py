from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.db import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_type = Column(String)
    question_text = Column(Text)
    subject = Column(String)
    image_url = Column(String, nullable=True)
    passage = Column(Text, nullable=True)
    marks = Column(Integer)
    difficulty_level = Column(String)
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer)

    options = relationship("Option", back_populates="question")


class Option(Base):
    __tablename__ = "options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    option_label = Column(String)
    option_text = Column(Text)
    is_correct = Column(Boolean, default=False)

    question = relationship("Question", back_populates="options")
