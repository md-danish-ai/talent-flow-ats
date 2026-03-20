
"""add department_id and test_level_id to paper_assignments

Revision ID: 21aac8226726
Revises: c2f9d6a8b321
Create Date: 2026-03-20 12:24:52.339349
Created By: unknown

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '21aac8226726'
down_revision: Union[str, Sequence[str], None] = 'c2f9d6a8b321'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column("paper_assignments", sa.Column("department_id", sa.Integer(), nullable=False))
    op.add_column("paper_assignments", sa.Column("test_level_id", sa.Integer(), nullable=False))
    
    op.create_foreign_key(
        "fk_paper_assignments_department", 
        "paper_assignments", "departments", 
        ["department_id"], ["id"]
    )
    op.create_foreign_key(
        "fk_paper_assignments_test_level", 
        "paper_assignments", "classifications", 
        ["test_level_id"], ["id"]
    )
    
    op.create_index(op.f("ix_paper_assignments_department_id"), "paper_assignments", ["department_id"], unique=False)
    op.create_index(op.f("ix_paper_assignments_test_level_id"), "paper_assignments", ["test_level_id"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_paper_assignments_test_level_id"), table_name="paper_assignments")
    op.drop_index(op.f("ix_paper_assignments_department_id"), table_name="paper_assignments")
    
    op.drop_constraint("fk_paper_assignments_test_level", "paper_assignments", type_="foreignkey")
    op.drop_constraint("fk_paper_assignments_department", "paper_assignments", type_="foreignkey")
    
    op.drop_column("paper_assignments", "test_level_id")
    op.drop_column("paper_assignments", "department_id")
