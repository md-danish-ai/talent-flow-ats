"""add_active_duration_seconds_to_interview_records

Revision ID: 3edb2b743922
Revises: b78405ff304e
Create Date: 2026-05-13 11:01:34.717898
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3edb2b743922'
down_revision: Union[str, Sequence[str], None] = 'b78405ff304e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add active_duration_seconds tracking column
    op.add_column('interview_records', sa.Column(
        'active_duration_seconds', sa.Integer(), server_default='0', nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove active_duration_seconds tracking column
    op.drop_column('interview_records', 'active_duration_seconds')
