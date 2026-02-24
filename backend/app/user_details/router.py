from fastapi import APIRouter, Depends, HTTPException
from app.auth.dependencies import get_current_user
from app.user_details.schemas import UserDetailsSchema
from app.user_details import service
from app.utils.status_codes import StatusCode

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
    return service.save_user_details(user_id, data)

@router.put("/update")
def update_user_details(
    data: UserDetailsSchema, 
    user_id: int = Depends(get_current_user)
):
    """
    Update existing user recruitment details.
    """
    return service.save_user_details(user_id, data)

@router.get("/me")
def get_my_details(user_id: int = Depends(get_current_user)):
    """
    Retrieve current user's recruitment details.
    """
    details = service.get_user_details(user_id)
    if not details:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND, 
            detail="Recruitment details not found for this user."
        )
    return details
