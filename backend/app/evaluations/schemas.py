from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict

class EvaluationMetricRating(BaseModel):
    metric_name: str
    rating: str # Excellent, Good, Average, Poor

class InterviewEvaluationBase(BaseModel):
    user_id: int
    project_lead_id: int
    attempt_id: int
    round_type: str = "F2F"
    status: str = "pending"
    evaluation_data: Dict[str, str] = {}
    overall_grade: Optional[str] = None
    final_verdict_id: Optional[int] = None
    comments: Optional[str] = None

class InterviewEvaluationCreate(BaseModel):
    user_id: int
    project_lead_id: int
    attempt_id: int
    round_type: Optional[str] = "F2F"

class InterviewEvaluationUpdate(BaseModel):
    evaluation_data: Dict[str, str]
    overall_grade: str
    final_verdict_id: int
    comments: Optional[str] = None
    status: str = "completed"

class InterviewEvaluationResponse(InterviewEvaluationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    # Optional fields for joined data
    candidate_name: Optional[str] = None
    lead_name: Optional[str] = None
    verdict_name: Optional[str] = None

    class Config:
        from_attributes = True
