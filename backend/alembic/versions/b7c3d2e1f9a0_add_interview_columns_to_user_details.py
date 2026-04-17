"""add interview columns to user_details

Revision ID: b7c3d2e1f9a0
Revises: a754d739dea7
Create Date: 2026-04-17 19:02:00.000000
Created By: md-danish-ai

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision: str = 'b7c3d2e1f9a0'
down_revision: Union[str, Sequence[str], None] = 'a754d739dea7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add missing columns to user_details table."""
    op.add_column('user_details', sa.Column('is_interview_submitted',
                  sa.Boolean(), server_default='false', nullable=False))
    op.add_column('user_details', sa.Column('is_reinterview',
                  sa.Boolean(), server_default='false', nullable=False))
    op.add_column('user_details', sa.Column(
        'reinterview_date', sa.Date(), nullable=True))


def downgrade() -> None:
    """Remove columns from user_details table."""
    op.drop_column('user_details', 'reinterview_date')
    op.drop_column('user_details', 'is_reinterview')
    op.drop_column('user_details', 'is_interview_submitted')
