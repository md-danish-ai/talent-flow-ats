import sys
import os
import re
import random
from datetime import datetime

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set default env vars for DB
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "5435")
os.environ.setdefault("DB_NAME", "talent_flow_ats")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")

from app.database.db import SessionLocal
from app.users.models import User
from app.auth.utils import hash_password
from app.departments.models import Department
from app.classifications.models import Classification

# List of real human names for data quality
REAL_NAMES = [
    "Aarav Sharma", "Aditi Rao", "Amit Patel", "Ananya Singh", "Arjun Verma",
    "Deepak Kumar", "Divya Reddy", "Gaurav Gupta", "Ishani Malhotra", "Karan Johar",
    "Megha Das", "Nikhil Saxena", "Pooja Hegde", "Rahul Dravid", "Sanya Mirza",
    "Vijay Iyer", "Yash Chopra", "Zoya Akhtar", "Rohan Mehra", "Sneha Kapoor",
    "Aman Taneja", "Bhavna Joshi", "Chirag Gandhi", "Esha Deol", "Farhan Khan",
    "Gautam Gambhir", "Hina Khan", "Jatin Sarna", "Kriti Sanon", "Lokesh Rahul",
    "Manoj Bajpayee", "Neha Kakkar", "Om Puri", "Pankaj Tripathi", "Riya Sen",
    "Suresh Raina", "Tanya Abrol", "Udit Narayan", "Varun Dhawan", "Yuvraj Singh",
    "Abhishek Bachchan", "Bipasha Basu", "Chetan Bhagat", "Disha Patani", "Emraan Hashmi",
    "Freida Pinto", "Gul Panag", "Hardik Pandya", "Irrfan Khan", "Jacqueline Fernandez"
]

def import_users():
    db = SessionLocal()
    try:
        # 1. Get correct IDs for KPO and FRESHER
        kpo_dept = db.query(Department).filter(Department.name.ilike("%KPO%")).first()
        fresher_level = db.query(Classification).filter(
            Classification.type == "exam_level", 
            Classification.code == "FRESHER"
        ).first()

        if not kpo_dept or not fresher_level:
            print("Error: Could not find KPO department or FRESHER level in database.")
            return

        print(f"Using Department: {kpo_dept.name} (ID: {kpo_dept.id})")
        # Cleanup existing bulk users and their data
        print("Cleaning up existing bulk users and their data...")
        target_user_ids = [u.id for u in db.query(User.id).filter(User.email.like("%@talentflow.ats")).all()]
        
        if target_user_ids:
            # Import models inside to avoid circular imports
            from app.paper_assignments.models import PaperAssignment
            from app.interview_attempts.models import InterviewRecord
            from app.user_details.models import UserDetail
            from app.evaluations.models import InterviewEvaluation
            
            # Delete in order of dependency
            db.query(InterviewEvaluation).filter(InterviewEvaluation.user_id.in_(target_user_ids)).delete(synchronize_session=False)
            db.query(PaperAssignment).filter(PaperAssignment.user_id.in_(target_user_ids)).delete(synchronize_session=False)
            db.query(UserDetail).filter(UserDetail.user_id.in_(target_user_ids)).delete(synchronize_session=False)
            db.query(InterviewRecord).filter(InterviewRecord.user_id.in_(target_user_ids)).delete(synchronize_session=False)
            
            # Now delete users
            db.query(User).filter(User.id.in_(target_user_ids)).delete(synchronize_session=False)
            db.commit()
            print(f"Purged {len(target_user_ids)} existing users and their records.")

        # 2. Read SQL File
        sql_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backups", "users_1.sql")
        if not os.path.exists(sql_path):
            print(f"Error: SQL file not found at {sql_path}")
            return

        with open(sql_path, "r") as f:
            lines = f.readlines()

        # 3. Parse and Insert
        total_added = 0
        total_skipped = 0
        
        default_hashed_password = hash_password("1234567890")
        
        # Regex to extract: username(1), mobile(2), email(3), password(4)
        # Updated to match the new SQL format (no ID column)
        pattern = re.compile(r"VALUES \('([^']*)',\s*'([^']*)',\s*(?:'([^']*)'|NULL),\s*'([^']*)'")

        for line in lines:
            if not line.strip() or "INSERT INTO" not in line:
                continue
                
            match = pattern.search(line)
            if match:
                # We extract the password and mobile from the file, but randomize the name and email
                _, mobile, _, password = match.groups()
                
                # Check duplication
                existing = db.query(User).filter(User.mobile == mobile).first()
                if existing:
                    total_skipped += 1
                    continue

                # Generate Real Name and Name-based Email
                real_name = random.choice(REAL_NAMES)
                email_prefix = real_name.lower().replace(" ", ".")
                email = f"{email_prefix}.{random.randint(10,99)}@talentflow.ats"

                new_user = User(
                    username=real_name,
                    mobile=mobile,
                    email=email,
                    password=default_hashed_password,
                    role="user",
                    is_active=True,
                    department_id=kpo_dept.id,
                    test_level_id=fresher_level.id,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                db.add(new_user)
                total_added += 1

        db.commit()
        print(f"\n✅ Premium Bulk import completed successfully!")
        print(f"   - Users Added with Real Profiles: {total_added}")
        print(f"   - Users Skipped (Duplicated): {total_skipped}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during import: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    import_users()
