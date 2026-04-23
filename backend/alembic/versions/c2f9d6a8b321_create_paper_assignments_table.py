"""create_paper_assignments_table

Revision ID: c2f9d6a8b321
Revises: bbebf9c48f6f
Create Date: 2026-03-19 12:20:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c2f9d6a8b321"
down_revision: Union[str, Sequence[str], None] = "bbebf9c48f6f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "paper_assignments",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("paper_id", sa.Integer(), nullable=False),
        sa.Column("assigned_date", sa.Date(), nullable=False),
        sa.Column("assigned_by", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["assigned_by"], ["users.id"]),
        sa.ForeignKeyConstraint(["paper_id"], ["papers.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id",
            "assigned_date",
            name="uq_paper_assignments_user_date",
        ),
    )
    op.create_index(
        op.f("ix_paper_assignments_assigned_date"),
        "paper_assignments",
        ["assigned_date"],
        unique=False,
    )
    op.create_index(
        op.f("ix_paper_assignments_id"),
        "paper_assignments",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_paper_assignments_paper_id"),
        "paper_assignments",
        ["paper_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_paper_assignments_user_id"),
        "paper_assignments",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_paper_assignments_user_id"), table_name="paper_assignments")
    op.drop_index(op.f("ix_paper_assignments_paper_id"), table_name="paper_assignments")
    op.drop_index(op.f("ix_paper_assignments_id"), table_name="paper_assignments")
    op.drop_index(
        op.f("ix_paper_assignments_assigned_date"), table_name="paper_assignments"
    )
    op.drop_table("paper_assignments")
