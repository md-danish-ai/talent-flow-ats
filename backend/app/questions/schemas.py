from pydantic import BaseModel
from typing import List, Optional
from enum import Enum


class QuestionType(str, Enum):
    multiple_choice = "multiple_choice"
    image_based_multiple_choice = "image_based_multiple_choice"
    subjective = "subjective"
    image_based_subjective = "image_based_subjective"
    passage_instructions = "passage_instructions"


class OptionCreate(BaseModel):
    option_label: str
    option_text: str
    is_correct: bool


class AnswerCreate(BaseModel):
    answer_text: Optional[str]
    explanation: Optional[str]


class QuestionCreate(BaseModel):
    question_type: QuestionType
    question_text: str
    subject: Optional[str] = None
    image_url: Optional[str] = None
    passage: Optional[str] = None
    marks: int
    difficulty_level: Optional[str] = None
    is_active: bool = True
    options: Optional[List[OptionCreate]] = None
    answer: Optional[AnswerCreate] = None


class OptionUpdate(BaseModel):
    option_label: str
    option_text: str
    is_correct: bool

class AnswerUpdate(BaseModel):
    answer_text: Optional[str] = None
    explanation: Optional[str] = None

class QuestionUpdate(BaseModel):
    question_type: Optional[str] = None
    question_text: Optional[str] = None
    subject: Optional[str] = None
    image_url: Optional[str] = None
    passage: Optional[str] = None
    marks: Optional[int] = None
    difficulty_level: Optional[str] = None
    is_active: Optional[bool] = None
    options: Optional[List[OptionUpdate]] = None
    answer: Optional[AnswerUpdate] = None
