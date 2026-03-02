# app/classifications/schemas.py

from pydantic import BaseModel, validator
from typing import Optional

VALID_TYPES = ["question_type", "subject", "exam_level"]


class ClassificationCreate(BaseModel):
    type: str
    name: str
    code: Optional[str] = None  # <-- allow user to provide code
    metadata: Optional[dict] = None
    sort_order: int = 0
    is_active: bool = True

    @validator("type")
    def validate_type(cls, field_value):
        if field_value not in ["question_type", "subject", "exam_level"]:
            raise ValueError(
                "type must be one of: question_type, subject, exam_level")
        return field_value

    @validator("code", always=True)
    def uppercase_code(cls, field_value, values):
        # if user didn't provide code, default to name.upper()
        if field_value is None and "name" in values:
            return values["name"].upper()
        if field_value:
            return field_value.upper()
        return field_value


class ClassificationUpdate(BaseModel):
    name:       Optional[str] = None
    metadata:   Optional[dict] = None
    sort_order: Optional[int] = None
    is_active:  Optional[bool] = None
    type:       Optional[str] = None
    code:       Optional[str] = None

    @validator("type")
    def validate_type(cls, field_value):
        if field_value and field_value not in VALID_TYPES:
            raise ValueError(f"type must be one of: {VALID_TYPES}")
        return field_value

    @validator("code", always=True)
    def uppercase_code(cls, field_value, values):
        # if user didn't provide code, default to name.upper()
        if field_value is None and "name" in values and values["name"]:
            return values["name"].upper().replace(" ", "_")
        if field_value:
            return field_value.upper().replace(" ", "_")
        return field_value


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
