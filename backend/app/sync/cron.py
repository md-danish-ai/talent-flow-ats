"""
Sync Cron Job — Daily Evening 6:00 PM (18:00 IST).

Uses APScheduler to schedule automatic background sync
for all candidates where user_details.is_synced == False.

This scheduler is started when FastAPI app starts up.
"""

import asyncio
import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.sync.service import create_sync_job, get_unsynced_user_ids, run_batch_sync

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def _daily_sync_job():
    """
    Called automatically every day at 6:00 PM.
    Fetches all unsynced candidates and runs a background batch sync.
    """
    logger.info("[CronSync] Daily 6 PM sync triggered.")

    user_ids = get_unsynced_user_ids()

    if not user_ids:
        logger.info("[CronSync] All candidates are synced. Nothing to do.")
        return

    logger.info(
        f"[CronSync] Found {len(user_ids)} unsynced candidates. Starting sync..."
    )

    job_id = create_sync_job(user_ids, trigger_type="CRON")

    # Run the full batch sync as a coroutine
    await run_batch_sync(job_id, user_ids)

    logger.info(f"[CronSync] Daily sync completed. Job ID: {job_id}")


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
        max_instances=1,  # Prevent overlapping runs
    )
    scheduler.start()
    logger.info("[CronSync] Scheduler started — daily sync at 18:00 IST")


def stop_scheduler():
    """Gracefully stop scheduler on FastAPI shutdown."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("[CronSync] Scheduler stopped.")
