# ruff: noqa
from app.database.db import SessionLocal
from app.auth.utils import hash_password
from app.users.models import User
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set default env vars for DB if not present
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "5435")
os.environ.setdefault("DB_NAME", "talent_flow_ats")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")

# ─────────────────────────────────────────────────────────────────────────────
# SEED USERS
#
# Password rule: password = mobile number (10 digits), bcrypt hashed
#
#   Admin  → mobile: 8829059600  | password: 8829059600  | role: admin
#   User   → mobile: 1234567890  | password: 1234567890  | role: user
# ─────────────────────────────────────────────────────────────────────────────

USERS = [
    {
        "username": "Mohammed Danish",
        "mobile":   "8829059600",
        "email":    "admin@arcgate.com",
        "role":     "admin",
        "test_level_code": None,
        "is_active": True,
    },
    {
        "username": "Test User",
        "mobile":   "1234567890",
        "email":    "user@arcgate.com",
        "role":     "user",
        "test_level_code": "FRESHER",
        "is_active": True,
    },
]


def seed_users():
    db = SessionLocal()
    try:
        print("🚀 Seeding users...")
        total_seeded = 0
        total_skipped = 0

        # Fetch level mapping
        from app.classifications.models import Classification
        levels = db.query(Classification).filter(Classification.type == "exam_level").all()
        level_map = {c.code: c.id for c in levels}

        for user_data in USERS:
            # Check if mobile already exists
            existing = db.query(User).filter(
                User.mobile == user_data["mobile"]
            ).first()

            if existing:
                total_skipped += 1
                print(
                    f"  ⏭ Skipped (already exists): "
                    f"{user_data['username']} [{user_data['role']}] "
                    f"— mobile: {user_data['mobile']}"
                )
                continue

            # Password = mobile number (bcrypt hashed)
            hashed_pw = hash_password(user_data["mobile"])

            new_user = User(
                username=user_data["username"],
                mobile=user_data["mobile"],
                email=user_data.get("email"),
                password=hashed_pw,
                role=user_data["role"],
                test_level_id=level_map.get(user_data.get("test_level_code")),
                is_active=user_data["is_active"],
                created_by=None,
            )
            db.add(new_user)
            db.flush()
            total_seeded += 1
            print(
                f"  ✅ Added [{user_data['role'].upper()}]: "
                f"{user_data['username']} — mobile: {user_data['mobile']}"
            )

        db.commit()
        print(f"\n✨ User seeding complete!")
        print(f"   Users added  : {total_seeded}")
        print(f"   Users skipped: {total_skipped}")
        print("\n📋 Login Credentials:")
        print("   ┌──────────┬────────────────┬────────────┬─────────────────────┐")
        print("   │ Role     │ Mobile         │ Password   │ Email               │")
        print("   ├──────────┼────────────────┼────────────┼─────────────────────┤")
        print("   │ Admin    │ 8829059600     │ 8829059600 │ admin@talentflow.com│")
        print("   │ User     │ 1234567890     │ 1234567890 │ user@talentflow.com │")
        print("   └──────────┴────────────────┴────────────┴─────────────────────┘")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding users: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_users()
