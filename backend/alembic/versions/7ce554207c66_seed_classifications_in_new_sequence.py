"""Seed classifications in new sequence

Revision ID: 7ce554207c66
Revises: dba95901fa50
Create Date: 2026-03-17 11:59:48.471531
Created By: md-danish-ai

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import json


# revision identifiers, used by Alembic.
revision: str = "7ce554207c66"
down_revision: Union[str, Sequence[str], None] = "dba95901fa50"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Classification Data in Global Sequence (1 to 31)
CLASSIFICATIONS = [
    # 1. Question Types (1 - 8)
    {
        "type": "question_type",
        "name": "Multiple Choice Question",
        "code": "MULTIPLE_CHOICE",
        "sort_order": 1,
        "metadata": {
            "description": "Standard professional recruitment questions with 4 distinct options (A, B, C, D). Focus on clear, unambiguous questions with one definitively correct answer and plausible distractors."
        },
    },
    {
        "type": "question_type",
        "name": "Image Multiple Choice",
        "code": "IMAGE_MULTIPLE_CHOICE",
        "sort_order": 2,
        "metadata": {
            "description": "Visual-centric MCQ. The question MUST directly reference the visual elements (charts, diagrams, or scenarios) described in the 'image_prompt'. Focus on observational and data-reading skills."
        },
    },
    {
        "type": "question_type",
        "name": "Subjective Question",
        "code": "SUBJECTIVE",
        "sort_order": 3,
        "metadata": {
            "description": "Open-ended questions assessing critical thinking and domain expertise. Require the candidate to provide a detailed written explanation of 2-3 sentences."
        },
    },
    {
        "type": "question_type",
        "name": "Image Subjective",
        "code": "IMAGE_SUBJECTIVE",
        "sort_order": 4,
        "metadata": {
            "description": "Analytic questions based on a visual scenario. Candidate must observe the 'image_prompt' content and provide a descriptive technical or strategic answer."
        },
    },
    {
        "type": "question_type",
        "name": "Passage Content",
        "code": "PASSAGE_CONTENT",
        "sort_order": 5,
        "metadata": {
            "description": "Reading comprehension. First, provide a professional 150-200 word passage in the 'passage' field, then create a question based on it with 4 MCQ options."
        },
    },
    {
        "type": "question_type",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "sort_order": 6,
        "metadata": {
            "description": "Paragraph-based assessment. Generate a structured text block (200-300 words) with professional content to test candidate's typing speed and accuracy."
        },
    },
    {
        "type": "question_type",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "sort_order": 7,
        "metadata": {
            "description": "Business development assessment. Focus on identifying potential leads, extracting professional contact info, and analyzing market opportunities."
        },
    },
    {
        "type": "question_type",
        "name": "Contact Details",
        "code": "CONTACT_DETAILS",
        "sort_order": 8,
        "metadata": {
            "description": "Data entry and accuracy assessment. Questions focused on correctly capturing and formatting professional contact information like emails and addresses."
        },
    },
    # 2. Exam Levels (9 - 11)
    {
        "type": "exam_level",
        "name": "Fresher",
        "code": "FRESHER",
        "sort_order": 9,
        "metadata": {
            "description": "Fundamental concepts and basic theoretical questions for entry-level candidates. Focus on clarity and core academic principles."
        },
    },
    {
        "type": "exam_level",
        "name": "Quality Assurance",
        "code": "QA",
        "sort_order": 10,
        "metadata": {
            "description": "Questions focused on testing lifecycles, bug reporting standards, automation vs manual testing, and high-level quality metrics."
        },
    },
    {
        "type": "exam_level",
        "name": "Team Lead",
        "code": "TEAMLEAD",
        "sort_order": 11,
        "metadata": {
            "description": "Leadership and strategy scenarios. Focus on team conflict resolution, project planning, resource optimization, and mentoring."
        },
    },
    # 3. Subjects (12 - 25)
    {
        "type": "subject",
        "name": "Written",
        "code": "WRITTEN",
        "sort_order": 12,
        "metadata": {
            "is_exclusive": False,
            "description": "Assessment of professional business writing skills. Focus on email drafting, report writing, and formal corporate communication.",
        },
    },
    {
        "type": "subject",
        "name": "Comprehension",
        "code": "COMPREHENSION",
        "sort_order": 13,
        "metadata": {
            "is_exclusive": False,
            "description": "Ability to understand written passages.",
        },
    },
    {
        "type": "subject",
        "name": "Grammar",
        "code": "GRAMMAR",
        "sort_order": 14,
        "metadata": {
            "is_exclusive": False,
            "description": "Testing of grammatical rules.",
        },
    },
    {
        "type": "subject",
        "name": "Aptitude",
        "code": "APTITUDE",
        "sort_order": 15,
        "metadata": {
            "is_exclusive": False,
            "description": "Logical reasoning, quantitative aptitude, and problem-solving. Focus on number series, probability, time-speed-distance, and logical deductions.",
        },
    },
    {
        "type": "subject",
        "name": "Brand Awareness",
        "code": "BRAND_AWARENESS",
        "sort_order": 16,
        "metadata": {
            "is_exclusive": False,
            "description": "Knowledge about brand identity, market positioning, target audience analysis, and corporate communication values.",
        },
    },
    {
        "type": "subject",
        "name": "Company Contact Details",
        "code": "COMPANY_CONTACT_DETAILS",
        "sort_order": 17,
        "metadata": {
            "is_exclusive": True,
            "description": "Knowledge regarding organizational contact structures, hierarchy, and professional data handling/formatting.",
        },
    },
    {
        "type": "subject",
        "name": "Data Interpretation & Analytics",
        "code": "DATA_INTERPRETATION_ANALYTICS",
        "sort_order": 18,
        "metadata": {
            "is_exclusive": False,
            "description": "Analyze complex data sets.",
        },
    },
    {
        "type": "subject",
        "name": "English",
        "code": "ENGLISH",
        "sort_order": 19,
        "metadata": {
            "is_exclusive": False,
            "description": "Professional English proficiency assessment including grammar, vocabulary, sentence structuring, and business communication.",
        },
    },
    {
        "type": "subject",
        "name": "Food Industry",
        "code": "FOOD_INDUSTRY",
        "sort_order": 20,
        "metadata": {
            "is_exclusive": False,
            "description": "Food safety and culinary trends.",
        },
    },
    {
        "type": "subject",
        "name": "Industry Awareness",
        "code": "INDUSTRY_AWARENESS",
        "sort_order": 21,
        "metadata": {
            "is_exclusive": False,
            "description": "General awareness concerning current global industry trends, market shifts, and emerging business technologies.",
        },
    },
    {
        "type": "subject",
        "name": "Real Estate",
        "code": "REAL_ESTATE",
        "sort_order": 22,
        "metadata": {
            "is_exclusive": False,
            "description": "Knowledge of property markets.",
        },
    },
    {
        "type": "subject",
        "name": "Lead Generation",
        "code": "LEAD_GENERATION",
        "sort_order": 23,
        "metadata": {
            "is_exclusive": True,
            "description": "B2B prospecting and business development strategies. Focus on cold outreach and qualifying potential clients.",
        },
    },
    {
        "type": "subject",
        "name": "Typing Test",
        "code": "TYPING_TEST",
        "sort_order": 24,
        "metadata": {
            "is_exclusive": True,
            "description": "Assessment of typing speed, accuracy, and endurance. Provide professional paragraphs with a mix of alphanumeric characters.",
        },
    },
    {
        "type": "subject",
        "name": "e-Commerce & Online Shopping",
        "code": "E_COMMERCE_ONLINE_SHOPPING",
        "sort_order": 25,
        "metadata": {"is_exclusive": False, "description": "Online retail operations."},
    },
    # 4. Interview Results (26 - 31)
    {
        "type": "interview_result",
        "name": "Must Hire",
        "code": "MUST_HIRE",
        "sort_order": 26,
        "metadata": {"description": "Top tier candidate, highly recommended."},
    },
    {
        "type": "interview_result",
        "name": "Good to Go",
        "code": "GOOD_TO_GO",
        "sort_order": 27,
        "metadata": {
            "description": "Strong candidate, meets all primary requirements."
        },
    },
    {
        "type": "interview_result",
        "name": "Fit for Process",
        "code": "FIT_FOR_PROCESS",
        "sort_order": 28,
        "metadata": {"description": "Meets basic criteria to continue in the process."},
    },
    {
        "type": "interview_result",
        "name": "Can be Given a Chance",
        "code": "GIVEN_CHANCE",
        "sort_order": 29,
        "metadata": {"description": "Borderline candidate with potential."},
    },
    {
        "type": "interview_result",
        "name": "Not Fit - Try Other Task",
        "code": "NOT_FIT_OTHER",
        "sort_order": 30,
        "metadata": {
            "description": "Not suitable for this role but could fit elsewhere."
        },
    },
    {
        "type": "interview_result",
        "name": "Not at all fit",
        "code": "NOT_FIT",
        "sort_order": 31,
        "metadata": {"description": "Does not meet requirements."},
    },
]

# Departments
DEPARTMENTS = [
    {"name": "KPO"},
    {"name": "BPO"},
    {"name": "QA"},
]


def upgrade() -> None:
    """Seed data in the specified order."""

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
        res = conn.execute(
            sa.text(
                "SELECT id FROM classifications WHERE code = :code AND type = :type"
            ),
            {"code": item["code"], "type": item["type"]},
        ).fetchone()

        metadata_json = json.dumps(item.get("metadata", {}))
        sort_order = item.get("sort_order", i + 1)
        allowed_keys.append((item["type"], item["code"]))

        if res:
            # Update existing
            conn.execute(
                sa.text(
                    "UPDATE classifications SET name = :name, metadata = :metadata, sort_order = :sort_order, is_active = :is_active WHERE code = :code AND type = :type"
                ),
                {
                    "name": item["name"],
                    "metadata": metadata_json,
                    "sort_order": sort_order,
                    "is_active": item.get("is_active", True),
                    "code": item["code"],
                    "type": item["type"],
                },
            )
        else:
            # Insert new
            conn.execute(
                sa.text(
                    "INSERT INTO classifications (code, type, name, metadata, sort_order, is_active) VALUES (:code, :type, :name, :metadata, :sort_order, :is_active)"
                ),
                {
                    "code": item["code"],
                    "type": item["type"],
                    "name": item["name"],
                    "metadata": metadata_json,
                    "sort_order": sort_order,
                    "is_active": item.get("is_active", True),
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
