from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import StreamingResponse
import asyncio
from app.core.realtime import realtime_manager
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.utils.dependencies import require_roles, authenticate_user
from app.utils.pagination import PaginationParams, get_pagination_params
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.duplicates.service import DuplicateService
from app.duplicates.schemas import NotificationReadRequest
from typing import Optional

router = APIRouter(prefix="/notifications", tags=["Admin Notifications"])


@router.get(
    "/get-all-notifications",
    dependencies=[Depends(require_roles(["admin", "project_lead"]))],
)
async def get_notifications(
    request: Request,
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
    pagination: PaginationParams = Depends(get_pagination_params),
    is_read: Optional[bool] = Query(None, description="Filter by read/unread status"),
):
    user_role = getattr(request.state, "user_role", None)
    target_user_id = None if user_role == "admin" else current_user

    service = DuplicateService(db)
    data = await service.get_notifications(pagination, is_read, target_user_id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.post(
    "/mark-read", dependencies=[Depends(require_roles(["admin", "project_lead"]))]
)
async def mark_notifications_read(
    request: Request,
    payload: NotificationReadRequest,
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
):
    user_role = getattr(request.state, "user_role", None)
    target_user_id = None if user_role == "admin" else current_user

    service = DuplicateService(db)
    count = await service.mark_read(payload.notification_ids, target_user_id)
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED,
        data={"message": f"{count} notifications marked as read"},
    )


@router.post(
    "/mark-unread", dependencies=[Depends(require_roles(["admin", "project_lead"]))]
)
async def mark_notifications_unread(
    request: Request,
    payload: NotificationReadRequest,
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
):
    user_role = getattr(request.state, "user_role", None)
    target_user_id = None if user_role == "admin" else current_user

    service = DuplicateService(db)
    count = await service.mark_unread(payload.notification_ids, target_user_id)
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED,
        data={"message": f"{count} notifications marked as unread"},
    )


@router.get("/stream")
async def stream_notifications(
    request: Request,
    current_user: int = Depends(authenticate_user),
):
    """
    SSE endpoint for real-time notifications.
    """
    user_role = getattr(request.state, "user_role", None)
    # Admin gets all global events, others get specific ones
    target_id = "admin" if user_role == "admin" else str(current_user)

    async def event_generator():
        print(f"SSE: User {target_id} connected")
        queue = await realtime_manager.subscribe(target_id)
        try:
            while True:
                if await request.is_disconnected():
                    print(f"SSE: User {target_id} disconnected")
                    break

                try:
                    data = await asyncio.wait_for(queue.get(), timeout=20.0)
                    print(f"SSE: Sending data to {target_id}: {data}")
                    yield f"data: {data}\n\n"
                except asyncio.TimeoutError:
                    yield ": keep-alive\n\n"

        except asyncio.CancelledError:
            print(f"SSE: User {target_id} cancelled")
            pass
        finally:
            await realtime_manager.unsubscribe(queue, target_id)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Critical for Nginx
        },
    )
