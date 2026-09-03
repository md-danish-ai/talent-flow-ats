from fastapi import APIRouter, BackgroundTasks, Depends, Query
from pydantic import BaseModel

from app.sync.service import (
    create_sync_job,
    run_batch_sync,
    get_unsynced_user_ids,
    get_unsynced_count,
)
from app.sync.models import SyncJob, UserSyncLog
from app.database.db import get_db
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import require_roles
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/sync", tags=["Sync"])


# ─────────────────────────────────────────────────────────────────────────────
# Schemas
# ─────────────────────────────────────────────────────────────────────────────


class StartBatchSyncPayload(BaseModel):
    user_ids: list[int]


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/v1/sync/start-batch
# Admin triggers a bulk or single-user sync.
# Returns immediately with job_id — actual sync runs in background.
# ─────────────────────────────────────────────────────────────────────────────


@router.post(
    "/start-batch",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def start_batch_sync(
    payload: StartBatchSyncPayload,
    background_tasks: BackgroundTasks,
):
    """
    Accepts a list of user_ids.
    Creates a SyncJob, starts async background processing, returns job_id immediately.
    """
    if not payload.user_ids:
        return api_response(
            StatusCode.BAD_REQUEST,
            "No user IDs provided. Please select at least one candidate.",
        )

    job_id = create_sync_job(payload.user_ids, trigger_type="MANUAL")

    # Add to FastAPI BackgroundTasks — non-blocking, runs after response is sent
    background_tasks.add_task(run_batch_sync, job_id, payload.user_ids)

    return api_response(
        StatusCode.ACCEPTED,
        "Sync job started successfully.",
        data={
            "job_id": job_id,
            "total_records": len(payload.user_ids),
            "status": "IN_PROGRESS",
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/v1/sync/start-all-pending
# Admin clicks "Sync All Pending" — auto-fetches all unsynced users.
# ─────────────────────────────────────────────────────────────────────────────


@router.post(
    "/start-all-pending",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def start_all_pending_sync(background_tasks: BackgroundTasks):
    """
    Fetches all users where is_synced=False and triggers a background batch sync.
    """
    user_ids = get_unsynced_user_ids()

    if not user_ids:
        return api_response(
            StatusCode.OK, "No pending candidates found. All are synced!"
        )

    job_id = create_sync_job(user_ids, trigger_type="MANUAL")
    background_tasks.add_task(run_batch_sync, job_id, user_ids)

    return api_response(
        StatusCode.ACCEPTED,
        f"Syncing {len(user_ids)} pending candidates in background.",
        data={
            "job_id": job_id,
            "total_records": len(user_ids),
            "status": "IN_PROGRESS",
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/sync/job-status/{job_id}
# Frontend polls this every 1.5-2 seconds for real-time progress bar.
# ─────────────────────────────────────────────────────────────────────────────


@router.get(
    "/job-status/{job_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
def get_job_status(job_id: str, db: Session = Depends(get_db)):
    """Returns current progress of a sync job."""
    job = db.query(SyncJob).filter(SyncJob.id == job_id).first()
    if not job:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND("Sync Job"))

    total = job.total_records or 0
    completed = job.completed_records or 0
    progress_pct = round((completed / total * 100), 1) if total > 0 else 0

    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED("Sync Job"),
        data={
            "job_id": job.id,
            "status": job.status,
            "trigger_type": job.trigger_type,
            "total_records": total,
            "completed_records": completed,
            "success_count": job.success_count,
            "failed_count": job.failed_count,
            "progress_pct": progress_pct,
            "created_at": job.created_at,
            "updated_at": job.updated_at,
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/sync/active-job
# Frontend calls this on page load to check if a job is already running.
# Used for page-refresh immunity.
# ─────────────────────────────────────────────────────────────────────────────


@router.get(
    "/active-job",
    dependencies=[Depends(require_roles(["admin"]))],
)
def get_active_job(db: Session = Depends(get_db)):
    """
    Returns the latest IN_PROGRESS job if one exists.
    Frontend uses this on page load to resume displaying a progress modal.
    """
    job = (
        db.query(SyncJob)
        .filter(SyncJob.status == "IN_PROGRESS")
        .order_by(SyncJob.created_at.desc())
        .first()
    )

    if not job:
        return api_response(StatusCode.OK, "No active sync job.", data=None)

    total = job.total_records or 0
    completed = job.completed_records or 0
    progress_pct = round((completed / total * 100), 1) if total > 0 else 0

    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED("Active Sync Job"),
        data={
            "job_id": job.id,
            "status": job.status,
            "total_records": total,
            "completed_records": completed,
            "success_count": job.success_count,
            "failed_count": job.failed_count,
            "progress_pct": progress_pct,
        },
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/sync/unsynced-count
# Frontend header badge — shows how many candidates are still pending sync.
# ─────────────────────────────────────────────────────────────────────────────


@router.get(
    "/unsynced-count",
    dependencies=[Depends(require_roles(["admin"]))],
)
def unsynced_count():
    """Returns count of candidates with is_synced=False."""
    count = get_unsynced_count()
    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED("Unsynced Count"),
        data={"unsynced_count": count},
    )


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/v1/sync/logs/{user_id}
# Admin can view full sync history for a specific candidate.
# ─────────────────────────────────────────────────────────────────────────────


@router.get(
    "/logs/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
def get_user_sync_logs(
    user_id: int,
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Returns sync history for a specific candidate (latest first)."""
    logs = (
        db.query(UserSyncLog)
        .filter(UserSyncLog.user_id == user_id)
        .order_by(UserSyncLog.synced_at.desc())
        .limit(limit)
        .all()
    )

    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED("Sync Logs"),
        data=[
            {
                "id": log.id,
                "job_id": log.job_id,
                "sync_status": log.sync_status,
                "verification_status": log.verification_status,
                "external_id": log.external_id,
                "error_message": log.error_message,
                "synced_at": log.synced_at,
            }
            for log in logs
        ],
    )
