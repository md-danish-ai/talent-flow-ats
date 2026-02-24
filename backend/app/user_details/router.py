from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.user_details.schemas import UserDetailsSchema
from app.user_details import service
from app.utils.status_codes import StatusCode, ResponseMessage, api_response

router = APIRouter()

@router.post("/add")
def add_user_details(
    data: UserDetailsSchema, 
    user_id: int = Depends(get_current_user)
):
    """
    Add user recruitment details. 
    If details already exist, they will be overwritten (updated).
    """
    result = service.save_user_details(user_id, data)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)

@router.put("/update")
def update_user_details(
    data: UserDetailsSchema, 
    user_id: int = Depends(get_current_user)
):
    """
    Update existing user recruitment details.
    """
    result = service.save_user_details(user_id, data)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=result)
