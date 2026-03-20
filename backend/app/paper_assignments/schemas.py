from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, field_validator


class PaperAssignmentCreate(BaseModel):
    user_id: int
    paper_id: int
    department_id: int
    test_level_id: int
    assigned_date: date

    @field_validator("assigned_date", mode="before")
    @classmethod
    def parse_assigned_date(cls, value):
        if isinstance(value, str):
            return date.fromisoformat(value)
        return value


class PaperAssignmentResponse(BaseModel):
    id: int
    user_id: int
    username: str
    paper_id: int
    paper_name: str
    assigned_date: date
    assigned_by: int
    assigned_by_name: str | None = None
    is_attempted: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
