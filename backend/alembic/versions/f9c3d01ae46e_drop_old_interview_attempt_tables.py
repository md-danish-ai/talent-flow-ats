
"""drop_old_interview_attempt_tables

Revision ID: f9c3d01ae46e
Revises: c8f42d8e1b20
Create Date: 2026-04-15 16:06:48.329976
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'f9c3d01ae46e'
down_revision: Union[str, Sequence[str], None] = 'c8f42d8e1b20'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_table('interview_attempt_responses')
    op.drop_table('interview_attempts')


def downgrade() -> None:
    """Downgrade schema."""
    pass
