from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel


class StartAttemptRequest(BaseModel):
    paper_id: int


class SaveAttemptAnswerRequest(BaseModel):
    answer_text: Optional[str] = None
    is_auto_saved: bool = False


class SubmitAttemptRequest(BaseModel):
    completion_reason: Literal["manual", "time_over"] = "manual"


class AttemptSummaryResponse(BaseModel):
    attempt_id: int
    paper_id: int
    user_id: int
    status: str
    completion_reason: Optional[str]
    started_at: datetime
    submitted_at: Optional[datetime]
    total_questions: int
    attempted_count: int
    unattempted_count: int
    obtained_marks: Optional[float]
    is_auto_submitted: bool


class AttemptStartResponse(BaseModel):
    attempt_id: int
    paper_id: int
    user_id: int
    status: str
    total_questions: int
    started_at: datetime
    paper_question_ids: list[int]


class SaveAnswerResponse(BaseModel):
    attempt_id: int
    question_id: int
    is_attempted: bool
    is_auto_saved: bool
    saved_at: datetime
