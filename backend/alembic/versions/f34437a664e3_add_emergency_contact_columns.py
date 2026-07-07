"""add emergency contact columns

Revision ID: f34437a664e3
Revises: c99e0571027a
Create Date: 2026-07-06 10:15:50.565670
Created By: md-danish-ai

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f34437a664e3"
down_revision: Union[str, Sequence[str], None] = "c99e0571027a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "user_details",
        sa.Column("emergency_contact_relation", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "user_details",
        sa.Column("assigned_emergency_relation", sa.String(length=50), nullable=True),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("user_details", "assigned_emergency_relation")
    op.drop_column("user_details", "emergency_contact_relation")
