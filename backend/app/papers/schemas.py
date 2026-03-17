from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from datetime import datetime

class SubjectConfigItem(BaseModel):
    subject_id: int
    is_selected: bool
    question_count: int
    total_marks: int
    time_minutes: int
    order: int

class PaperBase(BaseModel):
    paper_name: str
    description: Optional[str] = None
    department_id: int
    test_level_id: str
    subject_ids_data: List[SubjectConfigItem]

    @field_validator("subject_ids_data")
    @classmethod
    def sort_subjects(cls, v: List[SubjectConfigItem]) -> List[SubjectConfigItem]:
        return sorted(v, key=lambda x: x.order)
    question_id: List[int] = []
    total_time: Optional[str] = None
    total_marks: Optional[int] = None
    is_active: bool = True
    grade: Optional[str] = None

class PaperCreate(PaperBase):
    pass

class PaperUpdate(BaseModel):
    paper_name: Optional[str] = None
    description: Optional[str] = None
    department_id: Optional[int] = None
    test_level_id: Optional[str] = None
    subject_ids_data: Optional[List[SubjectConfigItem]] = None

    @field_validator("subject_ids_data")
    @classmethod
    def sort_subjects(
        cls, v: Optional[List[SubjectConfigItem]]
    ) -> Optional[List[SubjectConfigItem]]:
        if v is None:
            return v
        return sorted(v, key=lambda x: x.order)

    question_id: Optional[List[int]] = None
    total_time: Optional[str] = None
    total_marks: Optional[int] = None
    is_active: Optional[bool] = None
    grade: Optional[str] = None

class PaperResponse(PaperBase):
    id: int
    department_name: str
    test_level_name: str
    created_by: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
