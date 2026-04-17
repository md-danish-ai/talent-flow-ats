
"""add test_level_id to users

Revision ID: 8e5e9518d410
Revises: 805da4a656f5
Create Date: 2026-04-17 10:43:47.308938
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8e5e9518d410'
down_revision: Union[str, Sequence[str], None] = '805da4a656f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 1. Add test_level_id column
    op.add_column('users', sa.Column('test_level_id', sa.Integer(), sa.ForeignKey('classifications.id'), nullable=True))
    
    # 2. Migrate data from testlevel string to test_level_id
    # We join with classifications to find the ID matching the code
    op.execute("""
        UPDATE users
        SET test_level_id = c.id
        FROM classifications c
        WHERE users.testlevel = c.code 
        AND c.type = 'exam_level'
    """)
    
    # 3. Drop the old testlevel string column
    op.drop_column('users', 'testlevel')


def downgrade() -> None:
    """Downgrade schema."""
    # 1. Add back testlevel string column
    op.add_column('users', sa.Column('testlevel', sa.String(length=50), nullable=True))
    
    # 2. Revert data from test_level_id back to string code
    op.execute("""
        UPDATE users
        SET testlevel = c.code
        FROM classifications c
        WHERE users.test_level_id = c.id
    """)
    
    # 3. Drop the test_level_id column
    op.drop_column('users', 'test_level_id')
