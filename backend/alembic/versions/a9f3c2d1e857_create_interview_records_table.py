"""create_interview_records_table

Revision ID: a9f3c2d1e857
Revises: 24413fcd3336
Create Date: 2026-04-14 22:20:00.000000
Created By: md-danish-ai

Merges interview_attempts + interview_attempt_responses into one table.
Old tables are NOT dropped here — kept for safety until verified.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision: str = 'a9f3c2d1e857'
down_revision: Union[str, Sequence[str], None] = '24413fcd3336'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create interview_records table."""

    op.create_table(
        'interview_records',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('paper_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),

        sa.Column('status', sa.String(30), nullable=False, server_default='started'),
        sa.Column('completion_reason', sa.String(30), nullable=True),

        sa.Column('started_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('submitted_at', sa.TIMESTAMP(), nullable=True),

        sa.Column('total_questions', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('attempted_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('unattempted_count', sa.Integer(), nullable=False, server_default='0'),

        sa.Column('total_marks', sa.Numeric(10, 2), nullable=False, server_default='0'),
        sa.Column('obtained_marks', sa.Numeric(10, 2), nullable=False, server_default='0'),

        sa.Column('overall_grade', sa.String(20), nullable=False, server_default='N/A'),
        sa.Column('subject_grades', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),

        sa.Column('is_auto_submitted', sa.Boolean(), nullable=False, server_default='false'),

        sa.Column('responses', postgresql.JSONB(astext_type=sa.Text()), nullable=False, server_default='[]'),

        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),

        sa.ForeignKeyConstraint(['paper_id'], ['papers.id']),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint(
            "status IN ('started', 'submitted', 'auto_submitted', 'expired', 'system_error')",
            name='chk_interview_records_status',
        ),
        sa.CheckConstraint(
            "completion_reason IN ('manual', 'time_over')",
            name='chk_interview_records_completion_reason',
        ),
    )

    op.create_index('ix_interview_records_id', 'interview_records', ['id'], unique=False)
    op.create_index('ix_interview_records_user_id', 'interview_records', ['user_id'], unique=False)
    op.create_index('ix_interview_records_paper_id', 'interview_records', ['paper_id'], unique=False)


def downgrade() -> None:
    """Drop interview_records table."""
    op.drop_index('ix_interview_records_paper_id', table_name='interview_records')
    op.drop_index('ix_interview_records_user_id', table_name='interview_records')
    op.drop_index('ix_interview_records_id', table_name='interview_records')
    op.drop_table('interview_records')
