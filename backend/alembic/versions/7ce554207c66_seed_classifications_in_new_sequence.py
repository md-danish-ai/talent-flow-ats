"""Seed classifications in new sequence

Revision ID: 7ce554207c66
Revises: dba95901fa50
Create Date: 2026-03-17 11:59:48.471531
Created By: unknown

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "7ce554207c66"
down_revision: Union[str, Sequence[str], None] = "dba95901fa50"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Classification Data in Sequence: question_type, exam_level, subject
CLASSIFICATIONS = [
    # 1. Question Types
    {
        "type": "question_type",
        "name": "Multiple Choice Question",
        "code": "MULTIPLE_CHOICE",
    },
    {
        "type": "question_type",
        "name": "Image Multiple Choice",
        "code": "IMAGE_MULTIPLE_CHOICE",
    },
    {"type": "question_type", "name": "Subjective Question", "code": "SUBJECTIVE"},
    {"type": "question_type", "name": "Image Subjective", "code": "IMAGE_SUBJECTIVE"},
    {"type": "question_type", "name": "Passage Content", "code": "PASSAGE_CONTENT"},
    {"type": "question_type", "name": "Typing Test", "code": "TYPING_TEST"},
    {"type": "question_type", "name": "Lead Generation", "code": "LEAD_GENERATION"},
    {"type": "question_type", "name": "Contact Details", "code": "CONTACT_DETAILS"},
    # 2. Exam Levels
    {"type": "exam_level", "name": "Fresher", "code": "FRESHER"},
    {"type": "exam_level", "name": "Quality Assurance", "code": "QA"},
    {"type": "exam_level", "name": "Team Lead", "code": "TEAMLEAD"},
    # 3. Subjects
    {
        "type": "subject",
        "name": "Aptitude",
        "code": "APTITUDE",
        "metadata": {"description": "Logical reasoning and problem-solving."},
    },
    {
        "type": "subject",
        "name": "Brand Awareness",
        "code": "BRAND_AWARENESS",
        "metadata": {"description": "Knowledge about brand positioning."},
    },
    {
        "type": "subject",
        "name": "Company Contact Details Test",
        "code": "COMPANY_CONTACT_DETAILS_TEST",
        "metadata": {"description": "Testing accuracy in finding contact information."},
    },
    {
        "type": "subject",
        "name": "Company Details",
        "code": "COMPANY_DETAILS",
        "metadata": {
            "description": "Knowledge regarding company structure and history."
        },
    },
    {
        "type": "subject",
        "name": "Comprehension",
        "code": "COMPREHENSION",
        "metadata": {"description": "Ability to understand written passages."},
    },
    {
        "type": "subject",
        "name": "Data Interpretation & Analytics",
        "code": "DATA_INTERPRETATION_ANALYTICS",
        "metadata": {"description": "Analyze complex data sets."},
    },
    {
        "type": "subject",
        "name": "English",
        "code": "ENGLISH",
        "metadata": {
            "description": "Comprehensive assessment of English language proficiency."
        },
    },
    {
        "type": "subject",
        "name": "Excel",
        "code": "EXCEL",
        "metadata": {
            "description": "Proficient use of Microsoft Excel for data analysis."
        },
    },
    {
        "type": "subject",
        "name": "Food Industry",
        "code": "FOOD_INDUSTRY",
        "metadata": {"description": "Food safety and culinary trends."},
    },
    {
        "type": "subject",
        "name": "Grammar",
        "code": "GRAMMAR",
        "metadata": {"description": "Testing of grammatical rules."},
    },
    {
        "type": "subject",
        "name": "Industry Awareness",
        "code": "INDUSTRY_AWARENESS",
        "metadata": {"description": "Knowledge concerning current trends."},
    },
    {
        "type": "subject",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "metadata": {"description": "Testing skills in identifying potential clients."},
    },
    {
        "type": "subject",
        "name": "Real Estate",
        "code": "REAL_ESTATE",
        "metadata": {"description": "Knowledge of property markets."},
    },
    {
        "type": "subject",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "metadata": {"description": "Assessment of typing speed and accuracy."},
    },
    {
        "type": "subject",
        "name": "Written",
        "code": "WRITTEN",
        "metadata": {"description": "Assessment of professional writing skills."},
    },
    {
        "type": "subject",
        "name": "e-Commerce & Online Shopping",
        "code": "E_COMMERCE_ONLINE_SHOPPING",
        "metadata": {"description": "Online retail operations."},
    },
]

# 4. Departments
DEPARTMENTS = [
    {"name": "KPO"},
    {"name": "BPO"},
    {"name": "QA"},
]


def upgrade() -> None:
    """Seed data in the specified order."""
    import json

    conn = op.get_bind()

    # 1. Update Schema: Drop globally unique 'code' constraint and add composite (type, code)
    try:
        op.drop_constraint(
            "classifications_code_key", "classifications", type_="unique"
        )
    except Exception:
        pass

    try:
        op.create_unique_constraint(
            "classifications_type_code_key", "classifications", ["type", "code"]
        )
    except Exception:
        pass

    # 2. Seed Classifications
    allowed_keys = []
    for i, item in enumerate(CLASSIFICATIONS):
        # Specific check for (type, code)
        res = conn.execute(
            sa.text(
                "SELECT id FROM classifications WHERE code = :code AND type = :type"
            ),
            {"code": item["code"], "type": item["type"]},
        ).fetchone()

        metadata_json = json.dumps(item.get("metadata", {}))
        allowed_keys.append((item["type"], item["code"]))

        if res:
            # Update existing
            conn.execute(
                sa.text(
                    "UPDATE classifications SET name = :name, metadata = :metadata, sort_order = :sort_order, is_active = true WHERE code = :code AND type = :type"
                ),
                {
                    "name": item["name"],
                    "metadata": metadata_json,
                    "sort_order": i,
                    "code": item["code"],
                    "type": item["type"],
                },
            )
        else:
            # Insert new
            conn.execute(
                sa.text(
                    "INSERT INTO classifications (code, type, name, metadata, sort_order, is_active) VALUES (:code, :type, :name, :metadata, :sort_order, true)"
                ),
                {
                    "code": item["code"],
                    "type": item["type"],
                    "name": item["name"],
                    "metadata": metadata_json,
                    "sort_order": i,
                },
            )

    # 3. Seed Departments
    for dept_data in DEPARTMENTS:
        name = dept_data["name"]
        res = conn.execute(
            sa.text("SELECT id FROM departments WHERE name = :name"), {"name": name}
        ).fetchone()

        if res:
            conn.execute(
                sa.text("UPDATE departments SET is_active = true WHERE name = :name"),
                {"name": name},
            )
        else:
            conn.execute(
                sa.text(
                    "INSERT INTO departments (name, is_active) VALUES (:name, true)"
                ),
                {"name": name},
            )


def downgrade() -> None:
    """Cleanup new constraint and ideally restore old one."""
    try:
        op.drop_constraint(
            "classifications_type_code_key", "classifications", type_="unique"
        )
        op.create_unique_constraint(
            "classifications_code_key", "classifications", ["code"]
        )
    except Exception:
        pass
