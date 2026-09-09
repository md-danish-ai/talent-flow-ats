"""
Sync Service — Third-Party Candidate Sync.

Flow:
1. Admin clicks "Sync" (single or bulk) → router creates a SyncJob & calls this service.
2. Service runs as a FastAPI BackgroundTask:
   - Fetches fresh User + UserDetail data from DB.
   - Sends data to 3rd-party API in parallel chunks of 10.
   - Writes per-candidate result to user_sync_logs.
   - Updates user_details.is_synced on success.
   - Updates SyncJob progress counters in real-time.
3. Cron job (daily 6 PM) also calls this service for all unsynced users.
"""

import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

import httpx

from app.core.config import settings
from app.database.db import SessionLocal
from app.sync.models import SyncJob, UserSyncLog
from app.user_details.models import UserDetail
from app.users.models import User
from app.classifications.models import Classification  # noqa: F401
from app.departments.models import Department  # noqa: F401
from app.sync.logger import sync_logger

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Configuration — set ARCCRM_SYNC_URL in your .env
# ─────────────────────────────────────────────────────────────────────────────

ARCCRM_SYNC_URL = settings.ARCCRM_SYNC_URL  # e.g. "http://internal-api/sync/candidate"
CHUNK_SIZE = 10  # Parallel requests per chunk


# ─────────────────────────────────────────────────────────────────────────────
# Public helper: create a new SyncJob record in DB
# ─────────────────────────────────────────────────────────────────────────────


def create_sync_job(user_ids: list[int], trigger_type: str = "MANUAL") -> str:
    """
    Create a SyncJob row and return the job_id.
    Called by router before handing off to BackgroundTask.
    """
    job_id = f"SYNC-{uuid.uuid4().hex[:12].upper()}"
    db = SessionLocal()
    try:
        job = SyncJob(
            id=job_id,
            total_records=len(user_ids),
            completed_records=0,
            success_count=0,
            failed_count=0,
            status="IN_PROGRESS",
            trigger_type=trigger_type,
        )
        db.add(job)
        db.commit()
        logger.info(
            f"[SyncJob] Created {job_id} | total={len(user_ids)} | trigger={trigger_type}"
        )
    finally:
        db.close()
    return job_id


# ─────────────────────────────────────────────────────────────────────────────
# Internal: fetch candidate data from DB for given user IDs
# ─────────────────────────────────────────────────────────────────────────────


def _fetch_candidates(db, user_ids: list[int]) -> list[dict]:
    """
    JOIN users + user_details for fresh, real-time data.
    Returns a list of candidate dicts ready to send to 3rd-party API.
    """
    rows = (
        db.query(User, UserDetail)
        .join(UserDetail, User.id == UserDetail.user_id)
        .filter(User.id.in_(user_ids))
        .all()
    )

    candidates = []
    for user, detail in rows:
        candidates.append(
            {
                "user_id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
                "department_id": user.department_id,
                "test_level_id": user.test_level_id,
                "is_reinterview": detail.is_reinterview,
                "personal_details": detail.personal_details,
                "education_details": detail.education_details,
                "work_experience_details": detail.work_experience_details,
                "other_details": detail.other_details,
            }
        )
    return candidates


# ─────────────────────────────────────────────────────────────────────────────
# Internal: call 3rd-party API for a single candidate
# ─────────────────────────────────────────────────────────────────────────────


async def _sync_single_candidate(client: httpx.AsyncClient, candidate: dict) -> dict:
    """
    Call 3rd-party API for one candidate.
    Returns a result dict with sync outcome details.
    """
    user_id = candidate["user_id"]
    try:
        response = await client.post(
            ARCCRM_SYNC_URL,
            json=candidate,
            headers={"Content-Type": "application/json"},
            timeout=15.0,
        )
        response.raise_for_status()
        data = response.json()

        return {
            "user_id": user_id,
            "sync_status": "SUCCESS",
            "verification_status": data.get("verification", False),
            "external_id": str(data.get("id", "")),
            "request_payload": candidate,
            "response_payload": data,
            "error_message": None,
        }

    except httpx.HTTPStatusError as e:
        logger.warning(
            f"[Sync] HTTP error for user {user_id}: {e.response.status_code}"
        )
        return {
            "user_id": user_id,
            "sync_status": "FAILED",
            "verification_status": False,
            "external_id": None,
            "request_payload": candidate,
            "response_payload": None,
            "error_message": f"HTTP {e.response.status_code}: {e.response.text[:500]}",
        }
    except Exception as e:
        logger.error(f"[Sync] Unexpected error for user {user_id}: {e}")
        return {
            "user_id": user_id,
            "sync_status": "FAILED",
            "verification_status": False,
            "external_id": None,
            "request_payload": candidate,
            "response_payload": None,
            "error_message": str(e)[:500],
        }


# ─────────────────────────────────────────────────────────────────────────────
# Internal: persist single chunk results immediately to DB
# ─────────────────────────────────────────────────────────────────────────────


def _persist_chunk_results(
    db, job_id: Optional[str], results: list[dict]
) -> tuple[int, int]:
    """
    Write UserSyncLog rows, update user_details.is_synced, and update SyncJob counters.
    Uses bulk operations for maximum performance.
    Returns (success_count, failed_count).
    """
    success_user_ids = []
    failed_count = 0
    logs = []

    for result in results:
        user_id = result["user_id"]
        is_success = result["sync_status"] == "SUCCESS"

        if is_success:
            success_user_ids.append(user_id)
        else:
            failed_count += 1

        logs.append(
            UserSyncLog(
                job_id=job_id,
                user_id=user_id,
                external_id=result.get("external_id"),
                sync_status=result["sync_status"],
                verification_status=result.get("verification_status", False),
                request_payload=result.get("request_payload"),
                response_payload=result.get("response_payload"),
                error_message=result.get("error_message"),
            )
        )

    # Bulk insert audit logs
    if logs:
        db.add_all(logs)

    # Bulk update successful user_details records in 1 query
    if success_user_ids:
        db.query(UserDetail).filter(UserDetail.user_id.in_(success_user_ids)).update(
            {"is_synced": True, "synced_at": datetime.now(timezone.utc)},
            synchronize_session=False,
        )

    # Update SyncJob progress counters in 1 query
    success_count = len(success_user_ids)
    if job_id:
        job = db.query(SyncJob).filter(SyncJob.id == job_id).first()
        if job:
            job.completed_records = (job.completed_records or 0) + len(results)
            job.success_count = (job.success_count or 0) + success_count
            job.failed_count = (job.failed_count or 0) + failed_count

    db.commit()
    return success_count, failed_count


# ─────────────────────────────────────────────────────────────────────────────
# Public: main background task — runs in FastAPI BackgroundTasks
# ─────────────────────────────────────────────────────────────────────────────


async def run_batch_sync(job_id: str, user_ids: list[int]) -> dict:
    """
    Main async background task.
    Fetches fresh data, sends to 3rd-party in parallel chunks of 10.
    Designed to be called via FastAPI BackgroundTasks — non-blocking.
    Returns summary stats dict: {"success_count": int, "failed_count": int, "total": int}.
    """
    db = SessionLocal()
    total_success = 0
    total_failed = 0

    try:
        candidates = _fetch_candidates(db, user_ids)
        if not candidates:
            sync_logger.log_warning(
                f"No candidate profiles found in DB for given {len(user_ids)} user ID(s)"
            )
            _mark_job_done(db, job_id, failed=True)
            return {
                "success_count": 0,
                "failed_count": len(user_ids),
                "total": len(user_ids),
            }

        if not ARCCRM_SYNC_URL:
            err_msg = (
                "ArcCRM Sync URL is not configured in .env (ARCCRM_SYNC_URL is empty)"
            )
            sync_logger.log_error(err_msg)
            # Create failed audit logs
            failed_results = [
                {
                    "user_id": c["user_id"],
                    "sync_status": "FAILED",
                    "verification_status": False,
                    "external_id": None,
                    "request_payload": c,
                    "response_payload": None,
                    "error_message": err_msg,
                }
                for c in candidates
            ]
            _persist_chunk_results(db, job_id, failed_results)
            sync_logger.log_database(
                f"Recorded {len(candidates)} failure audit logs in user_sync_logs table"
            )
            _mark_job_done(db, job_id, failed=True)
            return {
                "success_count": 0,
                "failed_count": len(candidates),
                "total": len(candidates),
            }

        total_chunks = (len(candidates) + CHUNK_SIZE - 1) // CHUNK_SIZE

        async with httpx.AsyncClient() as client:
            for i in range(0, len(candidates), CHUNK_SIZE):
                chunk = candidates[i : i + CHUNK_SIZE]

                # Run this chunk in parallel
                tasks = [_sync_single_candidate(client, c) for c in chunk]
                results = await asyncio.gather(*tasks)

                # Persist results immediately after each chunk
                sc, fc = _persist_chunk_results(db, job_id, list(results))
                total_success += sc
                total_failed += fc

        # High-level ArcCRM transmission log matching backup.log style
        if total_failed == 0:
            sync_logger.log_sync(
                f"ArcCRM API: Successfully transmitted {total_success}/{len(candidates)} candidates across {total_chunks} chunk(s)"
            )
        elif total_success > 0:
            sync_logger.log_warning(
                f"ArcCRM API: Partial transmission — {total_success} succeeded, {total_failed} failed across {total_chunks} chunk(s)"
            )
        else:
            sync_logger.log_error(
                f"ArcCRM API: All {total_failed} candidate transmission(s) failed across {total_chunks} chunk(s)"
            )

        # Database state update log
        sync_logger.log_database(
            f"Updated user_details table: {total_success} marked is_synced=True & {len(candidates)} audit records saved in user_sync_logs"
        )

        # Mark job as completed
        is_failed = total_success == 0 and total_failed > 0
        _mark_job_done(db, job_id, failed=is_failed)

        return {
            "success_count": total_success,
            "failed_count": total_failed,
            "total": len(candidates),
        }

    except Exception as e:
        sync_logger.log_error(f"SyncJob {job_id} encountered fatal error: {e}")
        _mark_job_done(db, job_id, failed=True)
        return {
            "success_count": total_success,
            "failed_count": len(user_ids) - total_success,
            "total": len(user_ids),
        }
    finally:
        db.close()


def _mark_job_done(db, job_id: str, failed: bool = False):
    """Update SyncJob final status to COMPLETED or FAILED."""
    job = db.query(SyncJob).filter(SyncJob.id == job_id).first()
    if job:
        job.status = "FAILED" if failed else "COMPLETED"
        db.commit()


# ─────────────────────────────────────────────────────────────────────────────
# Public: fetch all unsynced user_ids (used by cron & "Sync All Pending" button)
# ─────────────────────────────────────────────────────────────────────────────


def get_unsynced_user_ids() -> list[int]:
    """
    Returns list of user IDs where user_details.is_synced == False.
    Used by both cron job and the "Sync All Pending" button.
    """
    db = SessionLocal()
    try:
        rows = (
            db.query(UserDetail.user_id)
            .filter(UserDetail.is_synced == False)  # noqa: E712
            .all()
        )
        return [row.user_id for row in rows]
    finally:
        db.close()


def get_unsynced_count() -> int:
    """Returns count of users pending sync."""
    db = SessionLocal()
    try:
        return (
            db.query(UserDetail)
            .filter(UserDetail.is_synced == False)  # noqa: E712
            .count()
        )
    finally:
        db.close()
