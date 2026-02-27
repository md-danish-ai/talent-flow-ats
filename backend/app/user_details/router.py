from fastapi import APIRouter, Depends
from app.user_details.schemas import UserDetailsSchema
from app.user_details import service
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import authenticate_user

router = APIRouter(
    prefix="/user-details",
    tags=["User Details"],
    dependencies=[Depends(authenticate_user)]
)


@router.post("/add")
def add_user_details(data: UserDetailsSchema, user_id: int = Depends(authenticate_user)):
    """
    Add user recruitment details.
    If details already exist, they will be overwritten (updated).
    """
    result = service.save_user_details(user_id, data)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)


@router.put("/update")
def update_user_details(
    data: UserDetailsSchema, user_id: int = Depends(authenticate_user)
):
    """
    Update existing user recruitment details.
    """
    result = service.save_user_details(user_id, data)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=result)


@router.get("/get/{id}")
def get_user_details_by_id(id: int):
    """
    Get user details by ID.
    """
    result = service.get_user_details(id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=result)
