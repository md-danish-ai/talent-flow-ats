from fastapi import APIRouter, HTTPException, status
from app.auth.schemas import SignUpSchema, SignInSchema
from app.auth.service import signup_user, signin_user

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(data: SignUpSchema):
    result = signup_user(data)

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=result["error"]
        )

    return result


@router.post("/signin", status_code=status.HTTP_200_OK)
async def signin(data: SignInSchema):
    result = signin_user(data)

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["error"]
        )

    return result
