"""seed_master_data_classifications

Revision ID: 88e73fe1b72e
Revises: 3edb2b743922
Create Date: 2026-07-03 11:11:01.590310
Created By: md-danish-ai

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "88e73fe1b72e"
down_revision: Union[str, Sequence[str], None] = "3edb2b743922"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute("""
        INSERT INTO classifications (type, code, name, sort_order, is_active) VALUES
        ('family_relation', 'FATHER', 'Father', 32, true),
        ('family_relation', 'MOTHER', 'Mother', 33, true),
        ('family_relation', 'HUSBAND', 'Husband', 34, true),
        ('family_relation', 'WIFE', 'Wife', 35, true),
        ('family_relation', 'SON', 'Son', 36, true),
        ('family_relation', 'DAUGHTER', 'Daughter', 37, true),
        ('family_relation', 'BROTHER', 'Brother', 38, true),
        ('family_relation', 'SISTER', 'Sister', 39, true),
        ('family_relation', 'GUARDIAN', 'Guardian', 40, true),
        ('marital_status', 'SINGLE', 'Single', 41, true),
        ('marital_status', 'MARRIED', 'Married', 42, true),
        ('marital_status', 'DIVORCED', 'Divorced', 43, true),
        ('marital_status', 'WIDOWED', 'Widowed', 44, true),
        ('marital_status', 'SEPARATED', 'Separated', 45, true),
        ('education_category', 'HIGH_SCHOOL', '10th / High School', 46, true),
        ('education_category', 'INTERMEDIATE', '12th / Intermediate', 47, true),
        ('education_category', 'DIPLOMA', 'Diploma', 48, true),
        ('education_category', 'BACHELORS', 'Bachelor''s Degree', 49, true),
        ('education_category', 'MASTERS', 'Master''s Degree', 50, true),
        ('education_category', 'DOCTORATE', 'Ph.D. / Doctorate', 51, true),
        ('language', 'ENGLISH', 'English', 52, true),
        ('language', 'HINDI', 'Hindi', 53, true),
        ('religion', 'HINDUISM', 'Hinduism', 54, true),
        ('religion', 'ISLAM', 'Islam', 55, true),
        ('religion', 'CHRISTIANITY', 'Christianity', 56, true),
        ('religion', 'SIKHISM', 'Sikhism', 57, true),
        ('religion', 'BUDDHISM', 'Buddhism', 58, true),
        ('religion', 'JAINISM', 'Jainism', 59, true),
        ('religion', 'OTHER', 'Other', 60, true),
        ('social_category', 'GENERAL', 'General', 61, true),
        ('social_category', 'OBC', 'OBC', 62, true),
        ('social_category', 'SC', 'SC', 63, true),
        ('social_category', 'ST', 'ST', 64, true),
        ('social_category', 'EWS', 'EWS', 65, true),
        ('blood_group', 'A_POSITIVE', 'A+', 66, true),
        ('blood_group', 'A_NEGATIVE', 'A-', 67, true),
        ('blood_group', 'B_POSITIVE', 'B+', 68, true),
        ('blood_group', 'B_NEGATIVE', 'B-', 69, true),
        ('blood_group', 'O_POSITIVE', 'O+', 70, true),
        ('blood_group', 'O_NEGATIVE', 'O-', 71, true),
        ('blood_group', 'AB_POSITIVE', 'AB+', 72, true),
        ('blood_group', 'AB_NEGATIVE', 'AB-', 73, true),
        ('employment_type', 'FULL_TIME', 'Full-time', 74, true),
        ('employment_type', 'PART_TIME', 'Part-time', 75, true),
        ('employment_type', 'CONTRACT', 'Contract', 76, true),
        ('employment_type', 'INTERNSHIP', 'Internship', 77, true)
        ON CONFLICT (type, code) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order, is_active = EXCLUDED.is_active;
    """)


def downgrade() -> None:
    """Downgrade schema."""

    op.execute("""
        DELETE FROM classifications WHERE type IN (
            'family_relation', 'marital_status', 'education_category', 
            'language', 'religion', 'social_category', 'blood_group', 'employment_type'
        );
    """)
