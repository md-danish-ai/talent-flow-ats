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


class InterviewPaperQuestionResponse(BaseModel):
    id: int
    type: str
    question_text: str
    subject_name: str | None = None
    type_name: str | None = None
    image_url: str | None = None
    passage: str | None = None
    marks: int | None = None
    options: list[str] = []


class InterviewPaperSectionResponse(BaseModel):
    id: str
    code: str
    title: str
    duration_minutes: int
    total_marks: int
    question_count: int
    questions: list[InterviewPaperQuestionResponse]


class InterviewPaperMetaResponse(BaseModel):
    id: int
    paper_name: str
    description: str | None = None
    total_time: str | None = None
    total_marks: int | None = None
    grade: str | None = None
    department_name: str | None = None
    test_level_name: str | None = None


class AssignedInterviewPaperResponse(BaseModel):
    assignment_id: int
    assigned_date: date
    paper: InterviewPaperMetaResponse
    total_questions: int
    overall_duration_minutes: int
    sections: list[InterviewPaperSectionResponse]


# Auto Assignment Rule Schemas

class AutoAssignmentRuleBase(BaseModel):
    department_id: int
    test_level_id: int
    assigned_date: date
    paper_ids: list[int]
    is_active: bool = True

    @field_validator("assigned_date", mode="before")
    @classmethod
    def parse_assigned_date(cls, value):
        if isinstance(value, str):
            return date.fromisoformat(value)
        return value


class AutoAssignmentRuleCreate(AutoAssignmentRuleBase):
    pass


class AutoAssignmentRuleUpdate(BaseModel):
    department_id: int | None = None
    test_level_id: int | None = None
    assigned_date: date | None = None
    paper_ids: list[int] | None = None
    is_active: bool | None = None

    @field_validator("assigned_date", mode="before")
    @classmethod
    def parse_assigned_date(cls, value):
        if value is None:
            return None
        if isinstance(value, str):
            return date.fromisoformat(value)
        return value


class AutoAssignmentRuleResponse(AutoAssignmentRuleBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    department_name: str | None = None
    test_level_name: str | None = None
    paper_names: list[str] = []

    model_config = ConfigDict(from_attributes=True)
