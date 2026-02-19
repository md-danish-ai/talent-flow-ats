from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from enum import Enum
import re

class TestLevelEnum(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

class SignUpSchema(BaseModel):
    username: str
    mobile: str
    testlevel: TestLevelEnum
    email: Optional[EmailStr] = None

    @validator("username")
    def validate_full_name(cls, value):
        value = value.strip()
        if len(value.split()) < 2:
            raise ValueError("Username must be full name")
        if not re.match(r"^[A-Za-z ]+$", value):
            raise ValueError("Username must contain only letters")
        return value

    @validator("mobile")
    def validate_mobile(cls, value):
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Mobile must be 10 digits")
        return value

    @validator("testlevel")
    def validate_testlevel(cls, value):
        if value not in TestLevelEnum:
            raise ValueError(f"Testlevel must be one of {[e.value for e in TestLevelEnum]}")
        return value


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

