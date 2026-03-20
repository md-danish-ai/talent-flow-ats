
"""add is_attempted to paper_assignments

Revision ID: 3f9d60802d28
Revises: 21aac8226726
Create Date: 2026-03-20 12:31:45.523921
Created By: unknown

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f9d60802d28'
down_revision: Union[str, Sequence[str], None] = '21aac8226726'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("paper_assignments", sa.Column("is_attempted", sa.Boolean(), server_default=sa.text("false"), nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    # Note: downgrade may need data handling if not just a drop
    op.drop_column("paper_assignments", "is_attempted")
