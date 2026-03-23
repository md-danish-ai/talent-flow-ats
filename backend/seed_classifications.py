
import os
import sys

# Add the project root to sys.path
sys.path.append(os.getcwd())

from app.database.db import SessionLocal
from app.classifications.models import Classification

def seed():
    db = SessionLocal()
    try:
        classifications = [
            # Subjects
            {"type": "subject_type", "name": "Industry Awareness", "code": "IA"},
            {"type": "subject_type", "name": "Comprehension", "code": "COMP"},
            {"type": "subject_type", "name": "Logical Reasoning", "code": "LR"},
            {"type": "subject_type", "name": "Quantitative Aptitude", "code": "QA"},
            
            # Question Types
            {"type": "question_type", "name": "Multiple Choice (Single Answer)", "code": "MCQ_SINGLE"},
            {"type": "question_type", "name": "Multiple Choice (Multi Answer)", "code": "MCQ_MULTI"},
            {"type": "question_type", "name": "Subjective", "code": "SUBJECTIVE"},
            {"type": "question_type", "name": "Passage Based", "code": "PASSAGE"},
            
            # Exam Levels
            {"type": "exam_level", "name": "Entry Level", "code": "ENTRY"},
            {"type": "exam_level", "name": "Intermediate", "code": "INTERMEDIATE"},
            {"type": "exam_level", "name": "Expert", "code": "EXPERT"},
        ]
        
        for c_data in classifications:
            existing = db.query(Classification).filter(
                Classification.name == c_data["name"],
                Classification.type == c_data["type"]
            ).first()
            if not existing:
                new_c = Classification(
                    name=c_data["name"],
                    type=c_data["type"],
                    code=c_data["code"],
                    is_active=True,
                    sort_order=0
                )
                db.add(new_c)
                print(f"Adding: {c_data['name']}")
        
        db.commit()
        print("Seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
