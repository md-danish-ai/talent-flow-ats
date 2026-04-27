import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database.db import SessionLocal
from app.classifications.models import Classification
from sqlalchemy.orm import Session

def seed_verdicts():
    db: Session = SessionLocal()
    try:
        verdicts = [
            {"code": "MUST_HIRE", "name": "Must Hire"},
            {"code": "GOOD_TO_GO", "name": "Good to Go"},
            {"code": "FIT_FOR_PROCESS", "name": "Fit for Process"},
            {"code": "GIVEN_CHANCE", "name": "Can be Given a Chance"},
            {"code": "NOT_FIT_OTHER", "name": "Not Fit - Can be tried in different Task"},
            {"code": "NOT_FIT", "name": "Not at all fit"},
        ]

        print("Seeding Interview Verdicts...")
        for i, v in enumerate(verdicts):
            existing = db.query(Classification).filter(
                Classification.type == "interview_verdict",
                Classification.code == v["code"]
            ).first()

            if not existing:
                new_c = Classification(
                    type="interview_verdict",
                    code=v["code"],
                    name=v["name"],
                    sort_order=i,
                    is_active=True
                )
                db.add(new_c)
                print(f"Added: {v['name']}")
            else:
                print(f"Exists: {v['name']}")
        
        db.commit()
        print("Seeding completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding verdicts: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_verdicts()
