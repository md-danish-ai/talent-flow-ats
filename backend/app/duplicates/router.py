from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.utils.dependencies import require_roles
from app.utils.pagination import PaginationParams, get_pagination_params
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.duplicates.service import DuplicateService
from app.duplicates.schemas import NotificationReadRequest
from typing import Optional

router = APIRouter(prefix="/notifications", tags=["Admin Notifications"])


@router.get("/get-all-notifications", dependencies=[Depends(require_roles(["admin"]))])
async def get_notifications(
    db: Session = Depends(get_db),
    pagination: PaginationParams = Depends(get_pagination_params),
    is_read: Optional[bool] = Query(None, description="Filter by read/unread status"),
):
    service = DuplicateService(db)
    data = await service.get_notifications(pagination, is_read)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.post("/mark-read", dependencies=[Depends(require_roles(["admin"]))])
async def mark_notifications_read(
    request: NotificationReadRequest, db: Session = Depends(get_db)
):
    service = DuplicateService(db)
    count = await service.mark_read(request.notification_ids)
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED,
        data={"message": f"{count} notifications marked as read"},
    )


@router.post("/mark-unread", dependencies=[Depends(require_roles(["admin"]))])
async def mark_notifications_unread(
    request: NotificationReadRequest, db: Session = Depends(get_db)
):
    service = DuplicateService(db)
    count = await service.mark_unread(request.notification_ids)
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED,
        data={"message": f"{count} notifications marked as unread"},
    )
