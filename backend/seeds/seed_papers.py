# ruff: noqa
# Auto-generated seed file from database backup
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.classifications.models import Classification
from app.departments.models import Department
from app.users.models import User
from app.papers.models import Paper

PAPERS_DATA = [
    {
        "id": 1,
        "paper_name": "Assessment Paper - Set A",
        "description": "Evaluation test paper matching all 8 subject specifications: Comprehension (MCQ), Grammar (MCQ), Grammar (Subjective), Written (Subjective), Aptitude (MCQ), Company Contact Details Test, Lead Generation Test, and Typing Test.",
        "department_id": 1,
        "test_level_id": 9,
        "subject_ids_data": [
            {"order": 1, "subject_id": 13, "is_selected": True, "total_marks": 10, "time_minutes": 10, "question_count": 5},
            {"order": 2, "subject_id": 14, "is_selected": True, "total_marks": 7, "time_minutes": 10, "question_count": 7},
            {"order": 3, "subject_id": 12, "is_selected": True, "total_marks": 40, "time_minutes": 20, "question_count": 10},
            {"order": 4, "subject_id": 15, "is_selected": True, "total_marks": 8, "time_minutes": 10, "question_count": 8},
            {"order": 5, "subject_id": 17, "is_selected": True, "total_marks": 5, "time_minutes": 5, "question_count": 5},
            {"order": 6, "subject_id": 16, "is_selected": True, "total_marks": 80, "time_minutes": 20, "question_count": 4},
            {"order": 7, "subject_id": 18, "is_selected": True, "total_marks": 20, "time_minutes": 5, "question_count": 1},
            {"order": 8, "subject_id": 19, "is_selected": True, "total_marks": 20, "time_minutes": 5, "question_count": 1}
        ],
        "question_id": [],
        "total_time": "01:25:00",
        "total_marks": 190,
        "is_active": True,
        "grade": None,
        "grade_settings": [
            {"max": 39.99, "min": 0.0, "grade_label": "Poor"},
            {"max": 49.99, "min": 40.0, "grade_label": "Below Average"},
            {"max": 64.99, "min": 50.0, "grade_label": "Average"},
            {"max": 74.99, "min": 65.0, "grade_label": "Above Average"},
            {"max": 84.99, "min": 75.0, "grade_label": "Good"},
            {"max": 100.0, "min": 85.0, "grade_label": "Excellent"}
        ],
        "created_by": 2
    },
    {
        "id": 2,
        "paper_name": "Assessment Paper - Set B",
        "description": "Evaluation test paper matching all 8 subject specifications: Comprehension (MCQ), Grammar (MCQ), Grammar (Subjective), Written (Subjective), Aptitude (MCQ), Company Contact Details Test, Lead Generation Test, and Typing Test.",
        "department_id": 1,
        "test_level_id": 9,
        "subject_ids_data": [
            {"order": 1, "subject_id": 13, "is_selected": True, "total_marks": 10, "time_minutes": 10, "question_count": 5},
            {"order": 2, "subject_id": 14, "is_selected": True, "total_marks": 7, "time_minutes": 10, "question_count": 7},
            {"order": 3, "subject_id": 12, "is_selected": True, "total_marks": 40, "time_minutes": 20, "question_count": 10},
            {"order": 4, "subject_id": 15, "is_selected": True, "total_marks": 8, "time_minutes": 10, "question_count": 8},
            {"order": 5, "subject_id": 17, "is_selected": True, "total_marks": 5, "time_minutes": 5, "question_count": 5},
            {"order": 6, "subject_id": 16, "is_selected": True, "total_marks": 80, "time_minutes": 20, "question_count": 4},
            {"order": 7, "subject_id": 18, "is_selected": True, "total_marks": 20, "time_minutes": 5, "question_count": 1},
            {"order": 8, "subject_id": 19, "is_selected": True, "total_marks": 20, "time_minutes": 5, "question_count": 1}
        ],
        "question_id": [],
        "total_time": "01:25:00",
        "total_marks": 190,
        "is_active": True,
        "grade": None,
        "grade_settings": [
            {"max": 39.99, "min": 0.0, "grade_label": "Poor"},
            {"max": 49.99, "min": 40.0, "grade_label": "Below Average"},
            {"max": 64.99, "min": 50.0, "grade_label": "Average"},
            {"max": 74.99, "min": 65.0, "grade_label": "Above Average"},
            {"max": 84.99, "min": 75.0, "grade_label": "Good"},
            {"max": 100.0, "min": 85.0, "grade_label": "Excellent"}
        ],
        "created_by": 2
    },
    {
        "id": 3,
        "paper_name": "Assessment Paper - Set C",
        "description": "Evaluation test paper matching all 8 subject specifications: Comprehension (MCQ), Grammar (MCQ), Grammar (Subjective), Written (Subjective), Aptitude (MCQ), Company Contact Details Test, Lead Generation Test, and Typing Test.",
        "department_id": 1,
        "test_level_id": 9,
        "subject_ids_data": [
            {"order": 1, "subject_id": 13, "is_selected": True, "total_marks": 10, "time_minutes": 10, "question_count": 5},
            {"order": 2, "subject_id": 14, "is_selected": True, "total_marks": 7, "time_minutes": 10, "question_count": 7},
            {"order": 3, "subject_id": 12, "is_selected": True, "total_marks": 40, "time_minutes": 20, "question_count": 10},
            {"order": 4, "subject_id": 15, "is_selected": True, "total_marks": 8, "time_minutes": 10, "question_count": 8},
            {"order": 5, "subject_id": 17, "is_selected": True, "total_marks": 5, "time_minutes": 5, "question_count": 5},
            {"order": 6, "subject_id": 16, "is_selected": True, "total_marks": 80, "time_minutes": 20, "question_count": 4},
            {"order": 7, "subject_id": 18, "is_selected": True, "total_marks": 20, "time_minutes": 5, "question_count": 1},
            {"order": 8, "subject_id": 19, "is_selected": True, "total_marks": 20, "time_minutes": 5, "question_count": 1}
        ],
        "question_id": [],
        "total_time": "01:25:00",
        "total_marks": 190,
        "is_active": True,
        "grade": None,
        "grade_settings": [
            {"max": 39.99, "min": 0.0, "grade_label": "Poor"},
            {"max": 49.99, "min": 40.0, "grade_label": "Below Average"},
            {"max": 64.99, "min": 50.0, "grade_label": "Average"},
            {"max": 74.99, "min": 65.0, "grade_label": "Above Average"},
            {"max": 84.99, "min": 75.0, "grade_label": "Good"},
            {"max": 100.0, "min": 85.0, "grade_label": "Excellent"}
        ],
        "created_by": 2
    }
]

def seed_papers():
    db = SessionLocal()
    try:
        print("🚀 Seeding papers from backup...")
        total_seeded = 0
        total_updated = 0

        # Delete any papers that are not in PAPERS_DATA to stay in sync
        seeded_ids = [item["id"] for item in PAPERS_DATA]
        deleted_count = db.query(Paper).filter(~Paper.id.in_(seeded_ids)).delete(synchronize_session=False)
        if deleted_count > 0:
            print(f"🗑️ Cleaned up {deleted_count} old paper records from DB.")

        for item in PAPERS_DATA:
            existing = db.query(Paper).filter(Paper.id == item["id"]).first()

            if existing:
                existing.paper_name = item["paper_name"]
                existing.description = item.get("description")
                existing.department_id = item["department_id"]
                existing.test_level_id = item["test_level_id"]
                existing.subject_ids_data = item["subject_ids_data"]
                existing.question_id = item["question_id"]
                existing.total_time = item.get("total_time")
                existing.total_marks = item.get("total_marks")
                existing.is_active = item.get("is_active", True)
                existing.grade = item.get("grade")
                existing.grade_settings = item.get("grade_settings")
                total_updated += 1
            else:
                paper = Paper(
                    id=item["id"],
                    paper_name=item["paper_name"],
                    description=item.get("description"),
                    department_id=item["department_id"],
                    test_level_id=item["test_level_id"],
                    subject_ids_data=item["subject_ids_data"],
                    question_id=item["question_id"],
                    total_time=item.get("total_time"),
                    total_marks=item.get("total_marks"),
                    is_active=item.get("is_active", True),
                    grade=item.get("grade"),
                    grade_settings=item.get("grade_settings"),
                    created_by=item.get("created_by", 2),
                )
                db.add(paper)
                total_seeded += 1

        db.commit()
        print(f"✨ Papers seeding complete! Added: {total_seeded}, Updated: {total_updated}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding papers: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_papers()
