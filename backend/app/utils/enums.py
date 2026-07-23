from enum import Enum


class ProcessStatus(str, Enum):
    PENDING = "pending"
    READY = "ready"
    INPROGRESS = "inprogress"
    SUBMITTED = "submitted"
    AUTO_SUBMITTED = "auto_submitted"
    EXPIRED = "expired"
    SYSTEM_ERROR = "system_error"


class RoleType(str, Enum):
    USER = "user"
    ADMIN = "admin"
    PROJECT_LEAD = "project_lead"


class InterviewStatus(str, Enum):
    STARTED = "started"
    SUBMITTED = "submitted"
    AUTO_SUBMITTED = "auto_submitted"


class EvaluationStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
