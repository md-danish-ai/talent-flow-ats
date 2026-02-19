from pydantic import BaseModel
from typing import Optional

class SignUpSchema(BaseModel):
    username: str
    mobile: str
    email: Optional[str] = None
    testlevel:str

class SignInSchema(BaseModel):
   username: Optional[str] = None
   mobile: str
   password: str
