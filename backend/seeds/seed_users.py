# ruff: noqa
# Auto-generated seed file from database on 2026-08-07 10:01:39
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.users.models import User

USERS_DATA = [
    {
        "id": 1,
        "username": "Mohammed Danish",
        "mobile": "8829059600",
        "email": "mohammed.danish@arcgate.com",
        "password": "$2b$12$qhDlv1qYBzPi4dOmC8ilke4LI2RXKuWlZ71ziZ1RWRzM1a/9Hzd.u",
        "role": "admin",
        "test_level_id": null,
        "department_id": null,
        "is_active": true,
        "process_status": "pending"
    },
    {
        "id": 2,
        "username": "Manish Joshi",
        "mobile": "6378297257",
        "email": "mmjoshi@arcgate.com",
        "password": "$2b$12$4tn6xzIeQXnJRlD9gsY3cuzZQ.5io/LPwPFm/W8aOHGm8IaFqLlfa",
        "role": "admin",
        "test_level_id": null,
        "department_id": null,
        "is_active": true,
        "process_status": "pending"
    },
    {
        "id": 3,
        "username": "Shubham Pal Singh",
        "mobile": "7014225334",
        "email": "shubham@arcgate.com",
        "password": "$2b$12$RB1FK9UKQ8byMDzL12i3UOE/9JJWJKbtRX38vql0F1RCglSYcyC.O",
        "role": "project_lead",
        "test_level_id": null,
        "department_id": null,
        "is_active": true,
        "process_status": "pending"
    },
    {
        "id": 4,
        "username": "Nilesh Jain",
        "mobile": "9828067566",
        "email": "nilesh@arcgate.com",
        "password": "$2b$12$dbN73Ii6sxuMfJzsQVQ3pOZrPjp0tg5L/g8MmRccg9ZDMPRpWJ95q",
        "role": "project_lead",
        "test_level_id": null,
        "department_id": null,
        "is_active": true,
        "process_status": "pending"
    },
    {
        "id": 5,
        "username": "Ankit Gurjar",
        "mobile": "9024287078",
        "email": "agurjar@arcgate.com",
        "password": "$2b$12$4Lx/jcsDYiRUpzQibwnnAut9tWdDeGhLsu4A15v3rcmJVz0/nUIIy",
        "role": "project_lead",
        "test_level_id": null,
        "department_id": null,
        "is_active": true,
        "process_status": "pending"
    },
    {
        "id": 6,
        "username": "Hina Dashora",
        "mobile": "9460326133",
        "email": "hina.dashora@arcgate.com",
        "password": "$2b$12$2NTVl105iq81MdcwfxvNBuVJHqKATg2412Z0yhm9BmKWEMimXUcua",
        "role": "project_lead",
        "test_level_id": null,
        "department_id": null,
        "is_active": true,
        "process_status": "pending"
    }
]

def seed_users():
    db = SessionLocal()
    try:
        print("🚀 Seeding users...")
        total_seeded = 0
        total_updated = 0

        for item in USERS_DATA:
            existing = db.query(User).filter(User.mobile == item["mobile"]).first()

            if existing:
                existing.username = item["username"]
                existing.email = item["email"]
                existing.role = item["role"]
                existing.test_level_id = item.get("test_level_id")
                existing.department_id = item.get("department_id")
                existing.is_active = item.get("is_active", True)
                existing.process_status = item.get("process_status", "pending")
                if item.get("password"):
                    existing.password = item["password"]
                total_updated += 1
            else:
                usr = User(
                    id=item["id"],
                    username=item["username"],
                    mobile=item["mobile"],
                    email=item["email"],
                    password=item["password"],
                    role=item["role"],
                    test_level_id=item.get("test_level_id"),
                    department_id=item.get("department_id"),
                    is_active=item.get("is_active", True),
                    process_status=item.get("process_status", "pending"),
                )
                db.add(usr)
                total_seeded += 1

        db.commit()
        print(f"✨ Users seeding complete! Added: {total_seeded}, Updated: {total_updated}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding users: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
