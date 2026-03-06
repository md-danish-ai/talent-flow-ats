"""create interview attempt tables

Revision ID: c1d4e7a9b2f3
Revises: 6ccb1459372e
Create Date: 2026-03-05 16:29:00.000000
Created By: varsha24-ag

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c1d4e7a9b2f3"
down_revision: Union[str, Sequence[str], None] = "6ccb1459372e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "interview_attempts",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("paper_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=30), server_default="started", nullable=False),
        sa.Column("completion_reason", sa.String(length=30), nullable=True),
        sa.Column(
            "started_at",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("submitted_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("total_questions", sa.Integer(), server_default="0", nullable=False),
        sa.Column("attempted_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("unattempted_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("obtained_marks", sa.Numeric(10, 2), nullable=True),
        sa.Column("is_auto_submitted", sa.Boolean(), server_default="false", nullable=False),
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
        sa.CheckConstraint(
            "status IN ('started', 'submitted', 'auto_submitted', 'expired')",
            name="chk_interview_attempts_status",
        ),
        sa.CheckConstraint(
            "completion_reason IN ('manual', 'time_over')",
            name="chk_interview_attempts_completion_reason",
        ),
        sa.ForeignKeyConstraint(["paper_id"], ["papers.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_interview_attempts_id"), "interview_attempts", ["id"], unique=False)
    op.create_index(
        "ix_interview_attempts_user_id_paper_id_status",
        "interview_attempts",
        ["user_id", "paper_id", "status"],
        unique=False,
    )

    op.create_table(
        "interview_attempt_answers",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("attempt_id", sa.Integer(), nullable=False),
        sa.Column("question_id", sa.Integer(), nullable=False),
        sa.Column("answer_text", sa.Text(), nullable=True),
        sa.Column("is_attempted", sa.Boolean(), server_default="false", nullable=False),
        sa.Column("is_auto_saved", sa.Boolean(), server_default="false", nullable=False),
        sa.Column(
            "saved_at",
            sa.TIMESTAMP(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
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
        sa.ForeignKeyConstraint(["attempt_id"], ["interview_attempts.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["question_id"], ["questions.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "attempt_id",
            "question_id",
            name="uq_interview_attempt_answers_attempt_question",
        ),
    )
    op.create_index(
        op.f("ix_interview_attempt_answers_id"),
        "interview_attempt_answers",
        ["id"],
        unique=False,
    )
    op.create_index(
        "ix_interview_attempt_answers_attempt_id",
        "interview_attempt_answers",
        ["attempt_id"],
        unique=False,
    )
    op.create_index(
        "ix_interview_attempt_answers_question_id",
        "interview_attempt_answers",
        ["question_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_interview_attempt_answers_question_id", table_name="interview_attempt_answers")
    op.drop_index("ix_interview_attempt_answers_attempt_id", table_name="interview_attempt_answers")
    op.drop_index(op.f("ix_interview_attempt_answers_id"), table_name="interview_attempt_answers")
    op.drop_table("interview_attempt_answers")

    op.drop_index("ix_interview_attempts_user_id_paper_id_status", table_name="interview_attempts")
    op.drop_index(op.f("ix_interview_attempts_id"), table_name="interview_attempts")
    op.drop_table("interview_attempts")
