from fastapi import APIRouter
from app.users.schemas import UserCreate, UserResponse
from app.users.service import UserService

router = APIRouter(prefix="/users", tags=["Users"])
user_service = UserService()


@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    return await user_service.create_user(user.dict())


@router.get("/{email}", response_model=UserResponse)
async def get_user(email: str):
    return await user_service.get_user_by_email(email)
