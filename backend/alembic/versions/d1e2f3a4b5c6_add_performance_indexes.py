"""add_performance_indexes_for_concurrent_candidates

Revision ID: d1e2f3a4b5c6
Revises: bbebf9c48f6f
Create Date: 2026-05-12 16:00:00.000000
Created By: md-danish-ai
Adds composite DB indexes to handle 50-100 concurrent candidates without
full table scans. Critical for:
- start_attempt: filters on (paper_id, user_id, status)
- get-my-assigned-paper: filters on (user_id, assigned_date)
- questions bulk fetch: filters on (subject_type, is_active)
"""

from typing import Sequence, Union
from alembic import op

revision: str = "d1e2f3a4b5c6"
down_revision: Union[str, Sequence[str], None] = "bbebf9c48f6f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Composite index for start_attempt query:
    # filter(paper_id == X, user_id == Y, status IN ("started"))
    # Create composite index only if the table exists (handles parallel branches)
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'interview_records') THEN
                CREATE INDEX IF NOT EXISTS ix_interview_records_paper_user_status
                ON interview_records (paper_id, user_id, status);
            END IF;
        END$$;
        """
    )

    # Composite index for get-my-assigned-paper query:
    # filter(user_id == X, assigned_date == today)
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'paper_assignments') THEN
                CREATE INDEX IF NOT EXISTS ix_paper_assignments_user_date
                ON paper_assignments (user_id, assigned_date);
            END IF;
        END$$;
        """
    )

    # Index for backfill_assignments_for_rule:
    # filter(assigned_date == X, user_id IN [...], is_attempted == False)
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'paper_assignments') THEN
                CREATE INDEX IF NOT EXISTS ix_paper_assignments_date_attempted
                ON paper_assignments (assigned_date, is_attempted);
            END IF;
        END$$;
        """
    )

    # Composite index for questions bulk fetch:
    # filter(subject_type == X, is_active == True)
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'questions') THEN
                CREATE INDEX IF NOT EXISTS ix_questions_subject_active
                ON questions (subject_type, is_active);
            END IF;
        END$$;
        """
    )


def downgrade() -> None:
    op.drop_index("ix_questions_subject_active", table_name="questions")
    op.drop_index("ix_paper_assignments_date_attempted", table_name="paper_assignments")
    op.drop_index("ix_paper_assignments_user_date", table_name="paper_assignments")
    op.drop_index(
        "ix_interview_records_paper_user_status", table_name="interview_records"
    )
