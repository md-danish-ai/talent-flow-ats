
"""rearrange_paper_columns_and_remove_obsolete

Revision ID: dba95901fa50
Revises: 1043a67c6410
Create Date: 2026-03-13 12:24:32.791005
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'dba95901fa50'
down_revision: Union[str, Sequence[str], None] = '1043a67c6410'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - recreate table to enforce column order."""
    # Drop dependent constraint first
    op.execute("ALTER TABLE interview_attempts DROP CONSTRAINT IF EXISTS interview_attempts_paper_id_fkey")
    
    # Drop existing table
    op.drop_table('papers')
    
    # Recreate table with columns in requested sequence
    op.create_table(
        'papers',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('paper_name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('department_id', sa.Integer(), nullable=False),
        sa.Column('test_level_id', sa.Integer(), nullable=False),
        sa.Column('subject_ids_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('question_id', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('total_time', sa.String(length=50), nullable=True),
        sa.Column('total_marks', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.Column('grade', sa.String(length=100), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['test_level_id'], ['classifications.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_papers_id'), 'papers', ['id'], unique=False)

    # Restore dependent constraint
    op.create_foreign_key(
        'interview_attempts_paper_id_fkey',
        'interview_attempts', 'papers',
        ['paper_id'], ['id']
    )


def downgrade() -> None:
    """Downgrade schema - simplified drop and recreate with old order."""
    op.execute("ALTER TABLE interview_attempts DROP CONSTRAINT IF EXISTS interview_attempts_paper_id_fkey")
    op.drop_table('papers')
    op.create_table(
        'papers',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('subject_id', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('question_id', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('duration', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('weights', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('grade', sa.String(length=100), nullable=True),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('paper_name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.String(length=1000), nullable=True),
        sa.Column('department_id', sa.Integer(), nullable=False),
        sa.Column('test_level_id', sa.Integer(), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('total_time', sa.String(length=50), nullable=True),
        sa.Column('total_marks', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.text('true'), nullable=False),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['department_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['test_level_id'], ['classifications.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_papers_id'), 'papers', ['id'], unique=False)
    op.create_foreign_key(
        'interview_attempts_paper_id_fkey',
        'interview_attempts', 'papers',
        ['paper_id'], ['id']
    )
