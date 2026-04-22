from fastapi import APIRouter, Depends
from app.utils.dependencies import authenticate_user, require_roles
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from .service import DashboardService
from .schemas import DashboardOverviewResponse

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard"],
    dependencies=[Depends(authenticate_user), Depends(require_roles(["admin"]))],
)

from datetime import date
from typing import Optional

service = DashboardService()

@router.get("/overview", response_model=None)
async def get_dashboard_overview(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """
    Get consolidated dashboard metrics for the admin overview, 
    optionally filtered by a date range.
    """
    data = await service.get_overview(start_date=start_date, end_date=end_date)
    return api_response(
        status_code=StatusCode.OK,
        message=ResponseMessage.FETCHED,
        data=data
    )
