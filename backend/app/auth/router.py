from fastapi import APIRouter, Depends, Query
from app.auth.schemas import SignUpSchema, SignInSchema, CreateAdminSchema
from app.auth.service import (
    signup_user,
    signin_user,
    create_admin,
    get_users_by_role,
    toggle_user_status,
    delete_user,
    get_user_by_id,
    update_user_basic_info
)
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import require_roles, authenticate_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/get-all-users", dependencies=[Depends(require_roles(["admin"]))])
async def get_users(
    role: str = Query(..., description="Role to filter users by (e.g., admin, user)"),
    date: str = Query(None, description="Single date filter (YYYY-MM-DD)"),
    date_from: str = Query(None, description="Range start date (YYYY-MM-DD)"),
    date_to: str = Query(None, description="Range end date (YYYY-MM-DD)"),
):
    data = get_users_by_role(role, date=date, date_from=date_from, date_to=date_to)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)



@router.get("/me")
async def get_me(user_id: int = Depends(authenticate_user)):
    user = get_user_by_id(user_id)
    if not user:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=user)


@router.post("/signup")
async def signup(data: SignUpSchema):
    result = signup_user(data)

    if "error" in result:
        return api_response(
            StatusCode.BAD_REQUEST, ResponseMessage.BAD_REQUEST, errors=result["error"]
        )

    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)


@router.post("/signin")
async def signin(data: SignInSchema):
    result = signin_user(data)

    if "error" in result:
        return api_response(
            StatusCode.UNAUTHORIZED,
            ResponseMessage.UNAUTHORIZED,
            errors=result["error"],
        )

    return api_response(StatusCode.OK, ResponseMessage.LOGIN_SUCCESS, data=result)


@router.post("/create-admin")
async def create_admin_user(data: CreateAdminSchema):
    result = create_admin(data)

    if "error" in result:
        return api_response(
            StatusCode.BAD_REQUEST, ResponseMessage.BAD_REQUEST, errors=result["error"]
        )

    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)


@router.put(
    "/toggle-status/{user_id}", dependencies=[Depends(require_roles(["admin"]))]
)
async def toggle_status(user_id: int):
    data = toggle_user_status(user_id)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.delete("/delete/{user_id}", dependencies=[Depends(require_roles(["admin"]))])
async def delete_user_route(user_id: int):
    data = delete_user(user_id)
    return api_response(StatusCode.OK, ResponseMessage.DELETED, data=data)


@router.put("/update-basic-info/{user_id}", dependencies=[Depends(require_roles(["admin"]))])
async def update_basic_info(user_id: int, data: SignUpSchema):
    """
    Update basic user info (username, mobile, email, testlevel, department_id).
    We reuse SignUpSchema fields for this.
    """
    result = update_user_basic_info(user_id, data)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=result)
