from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class AIQuestionRequest(BaseModel):
    question_type_id: int = Field(..., description="Classification ID for question type (e.g., MCQ)")
    subject_type_id: int = Field(..., description="Classification ID for subject (e.g., ENGLISH)")
    exam_level_id: int = Field(..., description="Classification ID for difficulty level (e.g., EASY)")
    number_of_questions: int = Field(default=1, ge=1, le=10)
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
