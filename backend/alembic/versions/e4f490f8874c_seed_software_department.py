"""seed_software_department

Revision ID: e4f490f8874c
Revises: f34437a664e3
Create Date: 2026-07-13 09:19:02.507094
Created By: md-danish-ai

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e4f490f8874c"
down_revision: Union[str, Sequence[str], None] = "f34437a664e3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """No-op: Software department is deprecated and no longer seeded."""
    pass


def downgrade() -> None:
    """Remove Software department (only if it was seeded, not manually created)."""
    conn = op.get_bind()
    conn.execute(sa.text("DELETE FROM departments WHERE name = 'Software'"))
