# app/questions/schemas.py

from pydantic import BaseModel
from typing import List, Optional, Any


class OptionCreate(BaseModel):
    option_label: str
    option_text: str
    is_correct: bool


class OptionUpdate(BaseModel):
    option_label: str
    option_text: str
    is_correct: bool


class AnswerCreate(BaseModel):
    answer_text: Optional[str] = None
    explanation: Optional[str] = None


class AnswerUpdate(BaseModel):
    answer_text: Optional[str] = None
    explanation: Optional[str] = None


class QuestionCreate(BaseModel):
    question_type: str
    subject: str
    exam_level: str
    question_text: str
    image_url: Optional[str] = None
    passage: Optional[str] = None
    marks: int
    is_active: bool = True
    options: Optional[Any] = None
    answer: AnswerCreate


class QuestionUpdate(BaseModel):
    question_type: Optional[str] = None
    subject: Optional[str] = None
    exam_level: Optional[str] = None
    question_text: Optional[str] = None
    image_url: Optional[str] = None
    passage: Optional[str] = None
    marks: Optional[int] = None
    is_active: Optional[bool] = None
    options: Optional[Any] = None
    answer: Optional[AnswerUpdate] = None


class QuestionIds(BaseModel):
    ids: List[int]


class AutoGenerateRequirement(BaseModel):
    type_code: str
    count: int


class AutoGenerateRequest(BaseModel):
    subject_code: str
    exam_level: str
    requirements: List[AutoGenerateRequirement]
