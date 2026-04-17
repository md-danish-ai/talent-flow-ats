
"""add department id to users

Revision ID: 805da4a656f5
Revises: 10c5585e78a2
Create Date: 2026-04-16 12:49:41.564945
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '805da4a656f5'
down_revision: Union[str, Sequence[str], None] = '10c5585e78a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column(
        'department_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_users_department', 'users',
                          'departments', ['department_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_users_department', 'users', type_='foreignkey')
    op.drop_column('users', 'department_id')
