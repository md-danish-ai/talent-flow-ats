from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class AIQuestionRequest(BaseModel):
    question_type: Dict[str, Any] = Field(..., description="Classification object for question type")
    subject_type: Dict[str, Any] = Field(..., description="Classification object for subject")
    exam_level: Dict[str, Any] = Field(..., description="Classification object for difficulty level")
    number_of_questions: int = Field(default=1, ge=1, le=10)
    marks: int = Field(default=1, ge=1, le=100)
    additional_context: Optional[str] = Field(None, description="Any additional context for prompt engineering")


class GeneratedQuestion(BaseModel):
    question_text: str
    options: Optional[Dict[str, str]] = None
    correct_answer: Optional[str] = None
    passage: Optional[str] = None
    explanation: Optional[str] = None


class AIQuestionResponse(BaseModel):
    status: str
    message: str
    data: List[Any] = []
