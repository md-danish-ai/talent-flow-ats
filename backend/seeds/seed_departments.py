import os
import sys

# Add the project root to sys.path BEFORE importing app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.db import SessionLocal
from app.departments.models import Department

DEPARTMENTS = [
    {"name": "BPO", "is_active": True},
    {"name": "KPO", "is_active": True},
    {"name": "QA", "is_active": True},
]

def seed_departments():
    db = SessionLocal()
    try:
        print("🌱 Seeding departments...")
        for dept_data in DEPARTMENTS:
            # Check if department already exists
            exists = db.query(Department).filter(Department.name == dept_data["name"]).first()
            if not exists:
                dept = Department(**dept_data)
                db.add(dept)
                print(f"✅ Added department: {dept_data['name']}")
            else:
                print(f"⏭️  Department already exists: {dept_data['name']}")
        db.commit()
        print("✨ Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding departments: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_departments()
