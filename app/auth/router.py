from fastapi import APIRouter
from app.auth.schemas import RegisterSchema, LoginSchema, TokenSchema
from app.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])
auth_service = AuthService()

@router.post("/register", response_model=dict)
async def register(user_data: RegisterSchema):
    return await auth_service.register_user(user_data.dict())

@router.post("/login", response_model=TokenSchema)
async def login(user_data: LoginSchema):
    return await auth_service.login_user(user_data.dict())
