from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from enum import Enum
import re


# ─── Shared Enums (single source of truth for both backend & frontend) ────



class RoleEnum(str, Enum):
    user = "user"
    admin = "admin"
    project_lead = "project_lead"


# ─── Sign Up Schema ──────────────────────────────────────────────────────


class SignUpSchema(BaseModel):
    name: str
    mobile: str
    test_level_id: int
    department_id: int
    email: Optional[EmailStr] = None

    @validator("email", pre=True)
    def empty_to_none(cls, field_value):
        if field_value == "":
            return None
        return field_value

    @validator("department_id", pre=True)
    def validate_dept_id(cls, value):
        if value == "":
            return None
        return value


class UpdateUserSchema(BaseModel):
    name: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None
    test_level_id: Optional[int] = None
    department_id: Optional[int] = None

    @validator("email", "department_id", pre=True)
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
