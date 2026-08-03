from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Text,
    TIMESTAMP,
    ForeignKey,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB

from app.database.db import Base


class SyncJob(Base):
    """
    Tracks a batch sync job (manual or cron-triggered).
    One job contains multiple user sync records via user_sync_logs.
    """

    __tablename__ = "sync_jobs"

    id = Column(String(255), primary_key=True, nullable=False)

    total_records = Column(Integer, nullable=False, default=0)
    completed_records = Column(Integer, nullable=False, default=0)
    success_count = Column(Integer, nullable=False, default=0)
    failed_count = Column(Integer, nullable=False, default=0)

    # Status: IN_PROGRESS | COMPLETED | FAILED
    status = Column(String(50), nullable=False, default="IN_PROGRESS")

    # Trigger type: MANUAL (Admin clicked) | CRON (Auto nightly job)
    trigger_type = Column(String(50), nullable=False, default="MANUAL")

    created_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
    )
    updated_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )


class UserSyncLog(Base):
    """
    Per-candidate sync audit log entry.
    Each row represents one sync attempt for one user within a job.
    """

    __tablename__ = "user_sync_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Reference to the parent batch job (nullable: single user sync may not create a job)
    job_id = Column(String(255), ForeignKey("sync_jobs.id"), nullable=True, index=True)

    # The candidate being synced
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    # ID returned by the third-party API on success
    external_id = Column(String(255), nullable=True)

    # Overall sync result: PENDING | SUCCESS | FAILED
    sync_status = Column(String(50), nullable=False, default="PENDING")

    # Verification boolean returned by third-party API (true/false)
    verification_status = Column(Boolean, nullable=False, default=False)

    # Full request body sent to third-party API (for debugging)
    request_payload = Column(JSONB, nullable=True)

    # Full raw response from third-party API (for debugging)
    response_payload = Column(JSONB, nullable=True)

    # Error details if sync failed
    error_message = Column(Text, nullable=True)

    synced_at = Column(
        TIMESTAMP,
        nullable=False,
        server_default=func.current_timestamp(),
    )
