
"""create states and districts tables and seed data

Revision ID: a2dee70412de
Revises: 88e73fe1b72e
Create Date: 2026-07-03 15:44:46.107256
Created By: md-danish-ai

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a2dee70412de'
down_revision: Union[str, Sequence[str], None] = '88e73fe1b72e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


import os
import json
from sqlalchemy.engine.reflection import Inspector

def upgrade() -> None:
    conn = op.get_bind()
    inspector = Inspector.from_engine(conn)
    tables = inspector.get_table_names()

    if 'states' not in tables:
        op.create_table(
            'states',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('code', sa.String(length=5), nullable=False),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('code', name='states_code_key')
        )
    
    if 'districts' not in tables:
        op.create_table(
            'districts',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('state_id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.ForeignKeyConstraint(['state_id'], ['states.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id')
        )
        
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(current_dir, '..', '..', 'seeds', 'india_states_districts.json')
    
    with open(json_path, 'r') as f:
        data = json.load(f)

    def generate_code(state_name, existing_codes):
        words = state_name.split()
        if len(words) == 1:
            base = state_name[:3].upper()
        else:
            base = "".join([word[0] for word in words if word.isalpha()]).upper()[:3]
        if not base:
            base = state_name[:3].upper()
        
        code = base
        counter = 1
        while code in existing_codes:
            code = f"{base}{counter}"[:5]
            counter += 1
        existing_codes.add(code)
        return code

    # Check if data already exists to avoid re-seeding
    result = conn.execute(sa.text("SELECT COUNT(*) FROM states"))
    count = result.scalar()
    
    if count == 0:
        existing_codes = set()
        for item in data:
            state_name = item['state']
            state_code = generate_code(state_name, existing_codes)
            
            result = conn.execute(
                sa.text("INSERT INTO states (name, code) VALUES (:name, :code) RETURNING id"),
                {"name": state_name, "code": state_code}
            )
            state_id = result.scalar()
            
            districts = item['districts']
            for dist_name in districts:
                conn.execute(
                    sa.text("INSERT INTO districts (state_id, name) VALUES (:state_id, :name)"),
                    {"state_id": state_id, "name": dist_name}
                )


def downgrade() -> None:
    op.drop_table('districts')
    op.drop_table('states')
