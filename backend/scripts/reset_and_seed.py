# backend/scripts/reset_and_seed.py

import os
import sys

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database.db import SessionLocal
from seeds.seed_all import seed_all

TABLES_TO_TRUNCATE = [
    "paper_assignments",
    "auto_assignment_rules",
    "interview_records",
    "interview_evaluations",
    "duplicate_user_matches",
    "admin_notifications",
    "user_details",
    "question_answers",
    "papers",
    "questions",
    "users",
    "classifications",
    "departments",
]


def reset_and_seed():
    db = SessionLocal()
    try:
        print("🧹 Clearing existing database tables...")
        truncate_sql = (
            f"TRUNCATE TABLE {','.join(TABLES_TO_TRUNCATE)} RESTART IDENTITY CASCADE;"
        )
        db.execute(text(truncate_sql))
        db.commit()
        print("✅ Database tables cleared successfully!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing database: {str(e)}")
        sys.exit(1)
    finally:
        db.close()

    # Seed fresh data from updated seed files
    seed_all()


if __name__ == "__main__":
    reset_and_seed()
