import sys
import os
import random

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.db import SessionLocal
from app.papers.models import Paper
from app.questions.models import Question
from app.departments.models import Department
from app.classifications.models import Classification
from app.users.models import User
from app.paper_assignments.models import PaperAssignment, AutoAssignmentRule
from app.interview_attempts.models import InterviewRecord

def seed_papers():
    db = SessionLocal()
    try:
        # 2. Clean Slate: Delete records, assignments, rules, and papers
        print("🗑️  Cleaning up existing data (InterviewRecords, Assignments, Rules, Papers)...")
        db.query(InterviewRecord).delete()
        db.query(PaperAssignment).delete()
        db.query(AutoAssignmentRule).delete()
        db.query(Paper).delete()
        db.commit()

        # 3. Admin ID
        admin = db.query(User).filter(User.role == "admin").first()
        admin_id = admin.id if admin else 1

        # 4. KPO और FRESHER की IDs
        kpo_dept = db.query(Department).filter(Department.name.ilike("%KPO%")).first()
        fresher_level = db.query(Classification).filter(
            Classification.type == "exam_level", 
            Classification.code == "FRESHER"
        ).first()

        if not kpo_dept or not fresher_level:
            print("Error: Missing KPO or FRESHER in database.")
            return

        # 5. FRESHER लेवल के सवालों को सब्जेक्ट-वाइज ग्रुप करना
        all_questions = db.query(Question).filter(
            Question.exam_level == "FRESHER",
            Question.is_active == True
        ).all()

        questions_by_subject = {}
        for q in all_questions:
            if q.subject_type not in questions_by_subject:
                questions_by_subject[q.subject_type] = []
            questions_by_subject[q.subject_type].append(q)

        available_subject_codes = list(questions_by_subject.keys())
        print(f"Grouping {len(all_questions)} questions into {len(available_subject_codes)} subjects.")

        # 6. 4 पेपर्स बनाना
        paper_names = ["KPO Standard Paper A", "KPO Standard Paper B", "KPO Standard Paper C", "KPO Standard Paper D"]
        
        for name in paper_names:
            selected_question_ids = []
            subject_config = []
            
            # हर सब्जेक्ट से 4 सवाल चुनना
            for i, sub_code in enumerate(available_subject_codes):
                q_list = questions_by_subject[sub_code]
                if len(q_list) < 4:
                    print(f"Warning: Subject {sub_code} has only {len(q_list)} questions. Picking all.")
                    picked = q_list
                else:
                    picked = random.sample(q_list, 4)
                
                selected_question_ids.extend([q.id for q in picked])
                
                # सब्जेक्ट ID ढूंढना
                sub_obj = db.query(Classification).filter(
                    Classification.type == "subject",
                    Classification.code == sub_code
                ).first()

                if sub_obj:
                    subject_config.append({
                        "subject_id": sub_obj.id,
                        "is_selected": True,
                        "question_count": len(picked),
                        "total_marks": len(picked) * 5, # 4 questions * 5 marks = 20
                        "time_minutes": 15,
                        "order": i
                    })

            new_paper = Paper(
                paper_name=name,
                description=f"Standard 20-marks per subject paper for KPO department. Total subjects: {len(subject_config)}.",
                department_id=kpo_dept.id,
                test_level_id=fresher_level.id,
                subject_ids_data=subject_config,
                question_id=selected_question_ids,
                total_time=str(len(subject_config) * 15), # 15 mins per subject
                total_marks=len(selected_question_ids) * 5,
                is_active=True,
                created_by=admin_id,
                grade="Percentage",
                grade_settings=[
                    {"min": 0.0, "max": 39.99, "grade_label": "Poor"},
                    {"min": 40.0, "max": 59.99, "grade_label": "Average"},
                    {"min": 60.0, "max": 79.99, "grade_label": "Good"},
                    {"min": 80.0, "max": 100.0, "grade_label": "Excellent"}
                ]
            )
            db.add(new_paper)
            print(f"✅ Created {name}: {len(selected_question_ids)} questions | Marks: {len(selected_question_ids) * 5}")

        db.commit()
        print("\n✨ Standardized Paper Seeding Complete!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during paper seeding: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_papers()
