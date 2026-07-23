from fastapi import APIRouter, Depends, Request
from app.user_details.schemas import UserDetailsSchema, AssignEmergencyRelationPayload
from app.user_details import service
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import authenticate_user

router = APIRouter(
    prefix="/user-details",
    tags=["User Details"],
    dependencies=[Depends(authenticate_user)],
)


@router.post("/save-user-details")
async def add_user_details(
    data: UserDetailsSchema,
    user_id: int = Depends(authenticate_user),
    request: Request = None,
):
    """
    Add user recruitment details.
    If details already exist, they will be overwritten (updated).
    """
    # Only run duplicate check if the user is a regular candidate (not admin/project_lead)
    run_check = True
    if request and getattr(request.state, "user_role", None) in [
        "admin",
        "project_lead",
    ]:
        run_check = False

    result = await service.save_user_details(
        user_id, data, run_duplicate_check=run_check
    )
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=result)


@router.put("/edit-user-details")
async def update_user_details(
    data: UserDetailsSchema,
    user_id: int = Depends(authenticate_user),
):
    """
    Update existing user recruitment details.
    """
    # Always disable duplicate check for updates/edits
    result = await service.save_user_details(user_id, data, run_duplicate_check=False)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=result)


@router.get("/get-user-details/{id}")
def get_user_details_by_id(id: int):
    """
    Get user details by ID.
    """
    result = service.get_user_details(id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=result)


@router.post("/assign-emergency-relation")
async def assign_emergency_relation(payload: AssignEmergencyRelationPayload):
    """
    Assign a custom emergency relation code to a specific user.
    """
    result = await service.assign_emergency_relation(
        payload.user_id, payload.relation_code
    )
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=result)
