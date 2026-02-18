from pydantic import BaseModel, EmailStr
from typing import Optional

class SignUpSchema(BaseModel):
    username: str
    mobile: str
    password: str
    email: Optional[str] = None

class SignInSchema(BaseModel):
   username: Optional[str] = None
   mobile: str
   password: str
