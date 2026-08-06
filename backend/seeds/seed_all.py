# ruff: noqa
# Auto-generated master seed runner on 2026-08-06 18:15:08
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from seeds.seed_departments import seed_departments
from seeds.seed_classifications import seed_classifications
from seeds.seed_users import seed_users
from seeds.seed_questions import seed_questions
from seeds.seed_papers import seed_papers
from seeds.seed_auto_rules import seed_auto_rules

from sqlalchemy import text
from app.database.db import SessionLocal

def sync_sequences():
    db = SessionLocal()
    try:
        print("🔄 Syncing primary key sequences in PostgreSQL...")
        tables = [
            ("questions", "questions_id_seq"),
            ("question_answers", "question_answers_id_seq"),
            ("users", "users_id_seq"),
            ("departments", "departments_id_seq"),
            ("classifications", "classifications_id_seq"),
            ("papers", "papers_id_seq"),
            ("auto_assignment_rules", "auto_assignment_rules_id_seq"),
        ]
        for tbl, seq in tables:
            query = f"SELECT setval('{seq}', COALESCE((SELECT MAX(id) FROM {tbl}), 1));"
            db.execute(text(query))
        db.commit()
        print("✨ Sequences synced successfully!")
    except Exception as e:
        db.rollback()
        print(f"⚠️ Warning syncing sequences: {e}")
    finally:
        db.close()

def seed_all():
    print("==================================================")
    print("🌱 STARTING FULL DATABASE SEEDING PROCESS")
    print("==================================================")
    
    seed_departments()
    seed_classifications()
    seed_users()
    seed_questions()
    seed_papers()
    seed_auto_rules()
    sync_sequences()

    print("==================================================")
    print("🎉 ALL SEEDS COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    seed_all()
