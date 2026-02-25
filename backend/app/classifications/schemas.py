# app/classifications/schemas.py

from pydantic import BaseModel, validator
from typing import Optional

VALID_TYPES = ["question_type", "subject_type", "exam_level"]


class ClassificationCreate(BaseModel):
    type: str
    name: str
    code: Optional[str] = None  # <-- allow user to provide code
    metadata: Optional[dict] = None
    sort_order: int = 0
    is_active: bool = True

    @validator("type")
    def validate_type(cls, v):
        if v not in ["question_type", "subject_type", "exam_level"]:
            raise ValueError(
                "type must be one of: question_type, subject_type, exam_level")
        return v

    @validator("code", always=True)
    def uppercase_code(cls, v, values):
        # if user didn't provide code, default to name.upper()
        if v is None and "name" in values:
            return values["name"].upper()
        if v:
            return v.upper()
        return v


class ClassificationUpdate(BaseModel):
    name:       Optional[str] = None
    metadata:   Optional[dict] = None
    sort_order: Optional[int] = None
    is_active:  Optional[bool] = None
    type:       Optional[str] = None
    code:       Optional[str] = None

    @validator("type")
    def validate_type(cls, v):
        if v not in VALID_TYPES:
            raise ValueError(f"type must be one of: {VALID_TYPES}")
        return v


class ClassificationResponse(BaseModel):
    id:         int
    code:       str
    type:       str
    name:       str
    metadata:   Optional[dict] = None
    is_active:  bool
    sort_order: int

    class Config:
        from_attributes = True
