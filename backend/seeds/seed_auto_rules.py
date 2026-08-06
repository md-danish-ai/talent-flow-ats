# ruff: noqa
# Auto-generated seed file from database on 2026-08-06 18:15:08
import sys
import os
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.departments.models import Department
from app.classifications.models import Classification
from app.users.models import User
from app.papers.models import Paper
from app.paper_assignments.models import AutoAssignmentRule

AUTO_RULES_DATA = [
    {
        "id": 1,
        "department_id": 1,
        "test_level_id": 9,
        "assigned_date": "2026-08-07",
        "paper_ids": [
            1
        ],
        "is_active": true,
        "created_by": 2
    }
]

def seed_auto_rules():
    db = SessionLocal()
    try:
        print("🚀 Seeding auto assignment rules...")
        total_seeded = 0
        total_updated = 0

        for item in AUTO_RULES_DATA:
            existing = db.query(AutoAssignmentRule).filter(AutoAssignmentRule.id == item["id"]).first()

            assigned_date_val = datetime.strptime(item["assigned_date"], "%Y-%m-%d").date() if isinstance(item["assigned_date"], str) else item["assigned_date"]

            if existing:
                existing.department_id = item["department_id"]
                existing.test_level_id = item["test_level_id"]
                existing.assigned_date = assigned_date_val
                existing.paper_ids = item["paper_ids"]
                existing.is_active = item.get("is_active", True)
                total_updated += 1
            else:
                rule = AutoAssignmentRule(
                    id=item["id"],
                    department_id=item["department_id"],
                    test_level_id=item["test_level_id"],
                    assigned_date=assigned_date_val,
                    paper_ids=item["paper_ids"],
                    is_active=item.get("is_active", True),
                    created_by=item.get("created_by", 1),
                )
                db.add(rule)
                total_seeded += 1

        db.commit()
        print(f"✨ Auto assignment rules seeding complete! Added: {total_seeded}, Updated: {total_updated}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding auto rules: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_auto_rules()
