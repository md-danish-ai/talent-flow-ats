"""rename attempt answers to responses

Revision ID: 5b7f0f5e0aa1
Revises: 3f9d60802d28
Create Date: 2026-03-26 11:30:00.000000
Created By: codex

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "5b7f0f5e0aa1"
down_revision: Union[str, Sequence[str], None] = "3f9d60802d28"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.rename_table("interview_attempt_answers", "interview_attempt_responses")
    op.execute(
        "ALTER INDEX ix_interview_attempt_answers_id "
        "RENAME TO ix_interview_attempt_responses_id"
    )

    op.drop_constraint(
        "uq_interview_attempt_answers_attempt_question",
        "interview_attempt_responses",
        type_="unique",
    )
    op.create_unique_constraint(
        "uq_interview_attempt_responses_attempt_question",
        "interview_attempt_responses",
        ["attempt_id", "question_id"],
    )

    op.add_column(
        "interview_attempt_responses",
        sa.Column("section_code", sa.String(length=100), nullable=True),
    )
    op.add_column(
        "interview_attempt_responses",
        sa.Column("section_name", sa.String(length=255), nullable=True),
    )

    op.execute(
        """
        UPDATE interview_attempt_responses AS responses
        SET
            section_code = COALESCE(NULLIF(q.subject_type, ''), 'GENERAL'),
            section_name = COALESCE(
                NULLIF(c.name, ''),
                INITCAP(REPLACE(COALESCE(NULLIF(q.subject_type, ''), 'GENERAL'), '_', ' '))
            )
        FROM questions AS q
        LEFT JOIN classifications AS c
            ON c.code = q.subject_type
           AND c.type = 'subject'
        WHERE responses.question_id = q.id
        """
    )

    op.alter_column(
        "interview_attempt_responses",
        "section_code",
        existing_type=sa.String(length=100),
        nullable=False,
    )
    op.alter_column(
        "interview_attempt_responses",
        "section_name",
        existing_type=sa.String(length=255),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(
        "uq_interview_attempt_responses_attempt_question",
        "interview_attempt_responses",
        type_="unique",
    )
    op.create_unique_constraint(
        "uq_interview_attempt_answers_attempt_question",
        "interview_attempt_responses",
        ["attempt_id", "question_id"],
    )

    op.drop_column("interview_attempt_responses", "section_name")
    op.drop_column("interview_attempt_responses", "section_code")

    op.rename_table("interview_attempt_responses", "interview_attempt_answers")
    op.execute(
        "ALTER INDEX ix_interview_attempt_responses_id "
        "RENAME TO ix_interview_attempt_answers_id"
    )


