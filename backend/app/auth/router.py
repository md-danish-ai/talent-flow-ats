from fastapi import APIRouter, HTTPException, Depends
from app.auth.schemas import SignUpSchema, SignInSchema, CreateAdminSchema
from app.auth.service import signup_user, signin_user, create_admin, get_user_by_id
from app.auth.dependencies import get_current_user
from app.utils.status_codes import StatusCode, ResponseMessage, api_response

router = APIRouter()


@router.get("/me")
async def get_me(user_id: int = Depends(get_current_user)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=StatusCode.NOT_FOUND, detail="User not found")
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=user)


@router.post("/signup")
async def signup(data: SignUpSchema):
    result = signup_user(data)

    if "error" in result:
        raise HTTPException(
            status_code=StatusCode.BAD_REQUEST,
            detail=result["error"]
        )

    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)


@router.post("/signin")
async def signin(data: SignInSchema):
    result = signin_user(data)

    if "error" in result:
        raise HTTPException(
            status_code=StatusCode.UNAUTHORIZED,
            detail=result["error"]
        )

    return api_response(StatusCode.OK, ResponseMessage.LOGIN_SUCCESS, data=result)


@router.post("/create-admin")
async def create_admin_user(data: CreateAdminSchema):
    result = create_admin(data)

    if "error" in result:
        raise HTTPException(
            status_code=StatusCode.BAD_REQUEST,
            detail=result["error"]
        )

    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)
