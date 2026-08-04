"""seed admin user

Revision ID: c8d7f6e5d4c3
Revises: b7c3d2e1f9a0
Create Date: 2026-04-17 19:05:00.000000
Created By: md-danish-ai

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision: str = "c8d7f6e5d4c3"
down_revision: Union[str, Sequence[str], None] = "b7c3d2e1f9a0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Seed the master admin users."""
    conn = op.get_bind()

    admins = [
        {
            "name": "Mohammed Danish",
            "mobile": "8829059600",
            "email": "mohammed.danish@arcgate.com",
            "pass": "$2b$12$qhDlv1qYBzPi4dOmC8ilke4LI2RXKuWlZ71ziZ1RWRzM1a/9Hzd.u",
            "role": "admin",
        },
        {
            "name": "Manish Joshi",
            "mobile": "6378297257",
            "email": "mmjoshi@arcgate.com",
            "pass": "$2b$12$zyPmizFvEMcHXB4pcxoQ7u5aWrGK8AlRS6qwywfUeAILhtyeUs0Vu",
            "role": "admin",
        },
    ]

    for admin in admins:
        res = conn.execute(
            sa.text("SELECT id FROM users WHERE mobile = :mobile"),
            {"mobile": admin["mobile"]},
        ).fetchone()

        if not res:
            conn.execute(
                sa.text(
                    "INSERT INTO users (username, mobile, email, password, role, is_active, test_level_id, department_id) "
                    "VALUES (:name, :mobile, :email, :pass, :role, true, null, null)"
                ),
                admin,
            )


def downgrade() -> None:
    """Remove the seeded admin users."""
    op.execute(
        sa.text("DELETE FROM users WHERE mobile IN ('8829059600', '6378297257')")
    )
