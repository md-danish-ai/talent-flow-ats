from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from enum import Enum
import re


# ─── Shared Enums (single source of truth for both backend & frontend) ────


class TestLevelEnum(str, Enum):
    fresher = "fresher"
    qa = "QA"
    team_lead = "team-lead"


class RoleEnum(str, Enum):
    user = "user"
    admin = "admin"


# ─── Sign Up Schema ──────────────────────────────────────────────────────


class SignUpSchema(BaseModel):
    name: str
    mobile: str
    testLevel: TestLevelEnum
    email: Optional[EmailStr] = None

    @validator("name")
    def validate_full_name(cls, value):
        value = value.strip()
        if len(value.split()) < 2:
            raise ValueError("Name must be full name (first and last)")
        if not re.match(r"^[A-Za-z ]+$", value):
            raise ValueError("Name must contain only letters")
        return value

    @validator("mobile")
    def validate_mobile(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Mobile must be 10 digits")
        return value


# ─── Sign In Schema ──────────────────────────────────────────────────────


class SignInSchema(BaseModel):
    mobile: str
    password: str

    @validator("mobile")
    def validate_mobile(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Mobile must be 10 digits")
        return value

    @validator("password")
    def validate_password(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Password must be 10 digits")
        return value


class CreateAdminSchema(BaseModel):
    name: str
    mobile: str
    email: Optional[EmailStr] = None

    @validator("name")
    def validate_full_name(cls, value):
        value = value.strip()
        if len(value.split()) < 2:
            raise ValueError("Name must be full name (first and last)")
        if not re.match(r"^[A-Za-z ]+$", value):
            raise ValueError("Name must contain only letters")
        return value

    @validator("mobile")
    def validate_mobile(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Mobile must be 10 digits")
        return value
