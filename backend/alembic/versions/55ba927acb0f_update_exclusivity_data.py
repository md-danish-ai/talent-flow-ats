
"""update_exclusivity_data

Revision ID: 55ba927acb0f
Revises: b4e828498495
Create Date: 2026-04-08 17:25:03.476421
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '55ba927acb0f'
down_revision: Union[str, Sequence[str], None] = 'b4e828498495'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()
    exclusive_codes = ('COMPANY_CONTACT_DETAILS',
                       'LEAD_GENERATION', 'TYPING_TEST')

    for code in exclusive_codes:
        conn.execute(
            sa.text(
                "UPDATE classifications SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{is_exclusive}', 'true'::jsonb) WHERE code = :code AND type = 'subject'"
            ),
            {"code": code}
        )


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()
    exclusive_codes = ('COMPANY_CONTACT_DETAILS',
                       'LEAD_GENERATION', 'TYPING_TEST')
    for code in exclusive_codes:
        # Remove is_exclusive from metadata if it exists
        conn.execute(
            sa.text(
                "UPDATE classifications SET metadata = metadata - 'is_exclusive' WHERE code = :code AND type = 'subject'"
            ),
            {"code": code}
        )
