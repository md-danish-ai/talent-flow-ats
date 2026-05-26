"""merge heads

Revision ID: b78405ff304e
Revises: 7a5eaaff678c, d1e2f3a4b5c6
Create Date: 2026-05-13 11:01:20.599946
Created By: md-danish-ai

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "b78405ff304e"
down_revision: Union[str, Sequence[str], None] = ("7a5eaaff678c", "d1e2f3a4b5c6")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
