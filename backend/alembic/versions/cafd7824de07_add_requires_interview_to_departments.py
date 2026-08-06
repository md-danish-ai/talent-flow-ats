"""add_requires_interview_to_departments

Revision ID: cafd7824de07
Revises: e4f490f8874c
Create Date: 2026-07-31 11:44:33.273997
Created By: md-danish-ai

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "cafd7824de07"
down_revision: Union[str, Sequence[str], None] = "e4f490f8874c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "departments",
        sa.Column(
            "requires_interview", sa.Boolean(), server_default="true", nullable=False
        ),
    )
    conn = op.get_bind()
    conn.execute(
        sa.text(
            "UPDATE departments SET requires_interview = false WHERE name = 'Other'"
        )
    )
    conn.execute(
        sa.text(
            "UPDATE departments SET requires_interview = true WHERE name = 'KPO & BPO'"
        )
    )
    conn.execute(
        sa.text("DELETE FROM departments WHERE name NOT IN ('KPO & BPO', 'Other')")
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("departments", "requires_interview")
