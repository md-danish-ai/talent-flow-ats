# ruff: noqa
# Auto-generated seed file from database on 2026-08-06 18:15:07
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.departments.models import Department

DEPARTMENTS_DATA = [
    {
        "id": 1,
        "name": "KPO & BPO",
        "is_active": true,
        "requires_interview": true
    },
    {
        "id": 2,
        "name": "Other",
        "is_active": true,
        "requires_interview": false
    }
]

def seed_departments():
    db = SessionLocal()
    try:
        print("🚀 Seeding departments...")
        total_seeded = 0
        total_updated = 0

        for item in DEPARTMENTS_DATA:
            existing = db.query(Department).filter(
                (Department.name == item["name"]) | (Department.id == item["id"])
            ).first()

            if existing:
                existing.name = item["name"]
                existing.is_active = item.get("is_active", True)
                existing.requires_interview = item.get("requires_interview", True)
                total_updated += 1
            else:
                dept = Department(
                    id=item["id"],
                    name=item["name"],
                    is_active=item.get("is_active", True),
                    requires_interview=item.get("requires_interview", True),
                )
                db.add(dept)
                total_seeded += 1

        db.commit()
        print(f"✨ Departments seeding complete! Added: {total_seeded}, Updated: {total_updated}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding departments: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_departments()
