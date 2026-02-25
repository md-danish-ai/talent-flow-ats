# app/questions/schemas.py

from pydantic import BaseModel
from typing import List, Optional


class OptionCreate(BaseModel):
    option_label: str
    option_text:  str
    is_correct:   bool


class OptionUpdate(BaseModel):
    option_label: str
    option_text:  str
    is_correct:   bool


class AnswerCreate(BaseModel):
    answer_text:  Optional[str] = None
    explanation:  Optional[str] = None



class AnswerUpdate(BaseModel):
    answer_text:  Optional[str] = None
    explanation:  Optional[str] = None


class QuestionCreate(BaseModel):
    question_type: str
    subject_type:  str
    exam_level:    str
    question_text: str
    image_url:     Optional[str] = None
    passage:       Optional[str] = None
    marks:         int
    is_active:     bool = True
    options:       List[OptionCreate]
    answer:        AnswerCreate



class QuestionUpdate(BaseModel):
    question_type: Optional[str] = None
    subject_type:  Optional[str] = None
    exam_level:    Optional[str] = None
    question_text: Optional[str] = None
    image_url:     Optional[str] = None
    passage:       Optional[str] = None
    marks:         Optional[int] = None
    is_active:     Optional[bool] = None
    options:       Optional[List[OptionUpdate]] = None
    answer:        Optional[AnswerUpdate] = None
