from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from datetime import datetime

class PaperBase(BaseModel):
    paper_name: str
    description: Optional[str] = None
    department_id: int
    test_level_id: int
    subject_id: Any
    question_id: Any
    total_time: Optional[str] = None
    total_marks: Optional[int] = None
    is_active: bool = True
    grade: Optional[str] = None

class PaperCreate(PaperBase):
    created_by: int

class PaperUpdate(BaseModel):
    paper_name: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[int] = None
    test_level_id: Optional[int] = None
    subject_id: Optional[Any] = None
    question_id: Optional[Any] = None
    total_time: Optional[str] = None
    total_marks: Optional[int] = None
    is_active: Optional[bool] = None
    grade: Optional[str] = None

class PaperResponse(PaperBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
