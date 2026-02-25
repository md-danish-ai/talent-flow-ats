from fastapi import APIRouter
from app.users.schemas import UserCreate
from app.users.service import UserService

from app.utils.status_codes import StatusCode, ResponseMessage, api_response

router = APIRouter()
user_service = UserService()


@router.post("/")
async def create_user(user: UserCreate):
    data = await user_service.create_user(user.dict())
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.get("/{email}")
async def get_user(email: str):
    data = await user_service.get_user_by_email(email)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)
