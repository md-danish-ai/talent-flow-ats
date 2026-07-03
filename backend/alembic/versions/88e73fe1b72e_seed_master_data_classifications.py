
"""seed_master_data_classifications

Revision ID: 88e73fe1b72e
Revises: 3edb2b743922
Create Date: 2026-07-03 11:11:01.590310
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '88e73fe1b72e'
down_revision: Union[str, Sequence[str], None] = '3edb2b743922'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute('''
        INSERT INTO classifications (type, code, name, is_active) VALUES
        ('family_relation', 'FATHER', 'Father', true),
        ('family_relation', 'MOTHER', 'Mother', true),
        ('family_relation', 'HUSBAND', 'Husband', true),
        ('family_relation', 'WIFE', 'Wife', true),
        ('family_relation', 'SON', 'Son', true),
        ('family_relation', 'DAUGHTER', 'Daughter', true),
        ('family_relation', 'BROTHER', 'Brother', true),
        ('family_relation', 'SISTER', 'Sister', true),
        ('family_relation', 'GUARDIAN', 'Guardian', true),
        ('marital_status', 'SINGLE', 'Single', true),
        ('marital_status', 'MARRIED', 'Married', true),
        ('marital_status', 'DIVORCED', 'Divorced', true),
        ('marital_status', 'WIDOWED', 'Widowed', true),
        ('marital_status', 'SEPARATED', 'Separated', true),
        ('education_category', 'HIGH_SCHOOL', '10th / High School', true),
        ('education_category', 'INTERMEDIATE', '12th / Intermediate', true),
        ('education_category', 'DIPLOMA', 'Diploma', true),
        ('education_category', 'BACHELORS', 'Bachelor''s Degree', true),
        ('education_category', 'MASTERS', 'Master''s Degree', true),
        ('education_category', 'DOCTORATE', 'Ph.D. / Doctorate', true),
        ('language', 'ENGLISH', 'English', true),
        ('language', 'HINDI', 'Hindi', true),
        ('religion', 'HINDUISM', 'Hinduism', true),
        ('religion', 'ISLAM', 'Islam', true),
        ('religion', 'CHRISTIANITY', 'Christianity', true),
        ('religion', 'SIKHISM', 'Sikhism', true),
        ('religion', 'BUDDHISM', 'Buddhism', true),
        ('religion', 'JAINISM', 'Jainism', true),
        ('religion', 'OTHER', 'Other', true),
        ('social_category', 'GENERAL', 'General', true),
        ('social_category', 'OBC', 'OBC', true),
        ('social_category', 'SC', 'SC', true),
        ('social_category', 'ST', 'ST', true),
        ('social_category', 'EWS', 'EWS', true),
        ('blood_group', 'A_POSITIVE', 'A+', true),
        ('blood_group', 'A_NEGATIVE', 'A-', true),
        ('blood_group', 'B_POSITIVE', 'B+', true),
        ('blood_group', 'B_NEGATIVE', 'B-', true),
        ('blood_group', 'O_POSITIVE', 'O+', true),
        ('blood_group', 'O_NEGATIVE', 'O-', true),
        ('blood_group', 'AB_POSITIVE', 'AB+', true),
        ('blood_group', 'AB_NEGATIVE', 'AB-', true),
        ('employment_type', 'FULL_TIME', 'Full-time', true),
        ('employment_type', 'PART_TIME', 'Part-time', true),
        ('employment_type', 'CONTRACT', 'Contract', true),
        ('employment_type', 'INTERNSHIP', 'Internship', true)
        ON CONFLICT (type, code) DO UPDATE SET name = EXCLUDED.name, is_active = EXCLUDED.is_active;
    ''')



def downgrade() -> None:
    """Downgrade schema."""

    op.execute('''
        DELETE FROM classifications WHERE type IN (
            'family_relation', 'marital_status', 'education_category', 
            'language', 'religion', 'social_category', 'blood_group', 'employment_type'
        );
    ''')

