from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str
    explanation: Optional[str] = None


class AnswerUpdate(BaseModel):
    answer_text: Optional[str] = None
    explanation: Optional[str] = None


class AnswerOut(BaseModel):
    id: int
    question_id: int
    answer_text: str
    explanation: Optional[str]
    created_by: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True