"""add_sync_tables_and_user_details_sync_fields

Revision ID: a1b2c3d4e5f6
Revises: cafd7824de07
Create Date: 2026-08-03 12:00:00.000000
Created By: md-danish-ai

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "cafd7824de07"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # 1. Add is_synced and synced_at to user_details
    op.add_column(
        "user_details",
        sa.Column("is_synced", sa.Boolean(), server_default="false", nullable=False),
    )
    op.add_column(
        "user_details",
        sa.Column("synced_at", sa.TIMESTAMP(), nullable=True),
    )
    op.create_index(
        "idx_user_details_is_synced",
        "user_details",
        ["is_synced"],
    )

    # 2. Create sync_jobs table
    op.create_table(
        "sync_jobs",
        sa.Column("id", sa.String(255), primary_key=True, nullable=False),
        sa.Column("total_records", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "completed_records", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column("success_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("failed_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "status", sa.String(50), nullable=False, server_default="'IN_PROGRESS'"
        ),
        sa.Column(
            "trigger_type", sa.String(50), nullable=False, server_default="'MANUAL'"
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index("idx_sync_jobs_status", "sync_jobs", ["status"])

    # 3. Create user_sync_logs table
    op.create_table(
        "user_sync_logs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column(
            "job_id", sa.String(255), sa.ForeignKey("sync_jobs.id"), nullable=True
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("external_id", sa.String(255), nullable=True),
        sa.Column(
            "sync_status", sa.String(50), nullable=False, server_default="'PENDING'"
        ),
        sa.Column(
            "verification_status", sa.Boolean(), nullable=False, server_default="false"
        ),
        sa.Column("request_payload", JSONB, nullable=True),
        sa.Column("response_payload", JSONB, nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column(
            "synced_at",
            sa.TIMESTAMP(),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )
    op.create_index("idx_user_sync_logs_user_id", "user_sync_logs", ["user_id"])
    op.create_index("idx_user_sync_logs_job_id", "user_sync_logs", ["job_id"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("idx_user_sync_logs_job_id", table_name="user_sync_logs")
    op.drop_index("idx_user_sync_logs_user_id", table_name="user_sync_logs")
    op.drop_table("user_sync_logs")

    op.drop_index("idx_sync_jobs_status", table_name="sync_jobs")
    op.drop_table("sync_jobs")

    op.drop_index("idx_user_details_is_synced", table_name="user_details")
    op.drop_column("user_details", "synced_at")
    op.drop_column("user_details", "is_synced")
