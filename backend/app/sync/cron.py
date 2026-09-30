"""
Sync Cron Job — Daily Evening 6:00 PM (18:00 IST).

Uses APScheduler to schedule automatic background sync
for all candidates where user_details.is_synced == False.

Logs all activities to logs/sync.log with IST timestamps.
This scheduler is started when FastAPI app starts up.
"""

import time
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.core.redis_client import redis_client
from app.sync.logger import sync_logger
from app.sync.service import create_sync_job, get_unsynced_user_ids, run_batch_sync

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()


async def _daily_sync_job():
    """
    Called automatically every day at 6:00 PM IST (18:00).
    Fetches all unsynced candidates and runs a background batch sync.
    Uses Redis lock to ensure only 1 worker executes in multi-worker (Gunicorn) setups.
    Logs structured output to logs/sync.log matching backup.log style.
    """
    # In multi-worker environments (e.g. Gunicorn -w 4), prevent duplicate execution
    lock_key = "lock:cron:daily_candidate_sync"
    if redis_client:
        try:
            # Acquire lock for 60 seconds (prevents concurrent workers from firing)
            acquired = redis_client.set(lock_key, "locked", nx=True, ex=60)
            if not acquired:
                return
        except Exception as e:
            logger.warning(
                f"[CronSync] Redis lock check error: {e}. Proceeding without lock."
            )

    start_time = time.time()
    sync_logger.log_start("Daily 6:00 PM IST Candidate Sync initiated (Cron)")

    try:
        user_ids = get_unsynced_user_ids()
        sync_logger.log_scan(
            f"Database checked: Found {len(user_ids)} unsynced candidate(s)"
        )

        if not user_ids:
            sync_logger.log_info(
                "All candidates are already synced. Zero pending records."
            )
            sync_logger.log_separator()
            return

        job_id = create_sync_job(user_ids, trigger_type="CRON")
        sync_logger.log_batch(
            f"Created SyncJob: {job_id} | Target: ArcCRM API | Total: {len(user_ids)} candidates"
        )

        # Run the full batch sync
        summary = await run_batch_sync(job_id, user_ids)
        elapsed = round(time.time() - start_time, 1)

        total_sc = summary.get("success_count", 0) if summary else 0
        total_fc = summary.get("failed_count", 0) if summary else 0

        if total_fc == 0:
            sync_logger.log_success(
                f"Candidate sync completed in {elapsed}s | Success: {total_sc} | Failed: 0"
            )
        elif total_sc > 0:
            sync_logger.log_warning(
                f"Candidate sync completed with issues in {elapsed}s | Success: {total_sc} | Failed: {total_fc}"
            )
        else:
            sync_logger.log_failed(
                f"Candidate sync failed in {elapsed}s | Success: 0 | Failed: {total_fc}"
            )

    except Exception as e:
        sync_logger.log_error(f"Daily sync encountered fatal error: {e}")
    finally:
        sync_logger.log_separator()


def start_scheduler():
    """
    Register cron job and start APScheduler.
    Called from FastAPI app startup event in main.py.

    Schedule: Daily at 18:00 (6:00 PM) — IST timezone.
    """
    scheduler.add_job(
        _daily_sync_job,
        trigger=CronTrigger(hour=18, minute=0, timezone="Asia/Kolkata"),
        id="daily_candidate_sync",
        name="Daily Candidate Sync (6 PM IST)",
        replace_existing=True,
        max_instances=1,  # Prevent overlapping runs within the same process
    )
    scheduler.start()
    logger.info(
        "[CronSync] Scheduler started — configured for daily 6:00 PM IST (18:00)"
    )


def stop_scheduler():
    """Gracefully stop scheduler on FastAPI shutdown."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("[CronSync] Scheduler stopped gracefully.")
