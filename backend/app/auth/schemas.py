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

    @validator("email", pre=True)
    def empty_to_none(cls, field_value):
        if field_value == "":
            return None
        return field_value

    @validator("name")
    def validate_full_name(cls, value):
        value = value.strip()
        if len(value.split()) < 2:
            raise ValueError("Please provide your full name (first and last name).")
        if not re.match(r"^[A-Za-z ]+$", value):
            raise ValueError("Full name must only contain alphabetic characters.")
        return value

    @validator("mobile")
    def validate_mobile(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("The mobile number must be exactly 10 digits.")
        return value


# ─── Sign In Schema ──────────────────────────────────────────────────────


class SignInSchema(BaseModel):
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None
    password: str
    role: RoleEnum

    @validator("mobile", "email", pre=True)
    def empty_to_none(cls, field_value):
        if field_value == "":
            return None
        return field_value

    @validator("mobile")
    def validate_mobile(cls, value):
        if value:
            if not re.match(r"^[0-9]{10}$", value):
                raise ValueError("Mobile must be 10 digits")
        return value

    @validator("password")
    def validate_password(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Password must be 10 digits")
        return value

    @validator("role")
    def validate_fields_by_role(cls, field_value, values):
        mobile = values.get("mobile")
        email = values.get("email")

        if field_value == RoleEnum.user:
            if not mobile:
                raise ValueError("Mobile number is required for user login")
        elif field_value == RoleEnum.admin:
            if not mobile and not email:
                raise ValueError("Either mobile or email is required for admin login")

        return v


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
