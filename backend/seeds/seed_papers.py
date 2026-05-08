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
from app.utils.grade_utils import GradeLabel

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

        # 6. 4 पेपर्स बनाना (Subjects Distribution)
        paper_data = [
            {"name": "KPO Standard Paper A", "start": 0, "end": 4},
            {"name": "KPO Standard Paper B", "start": 4, "end": 8},
            {"name": "KPO Standard Paper C", "start": 8, "end": 12},
            {"name": "KPO Standard Paper D", "start": 12, "end": 14},
        ]
        
        for config in paper_data:
            name = config["name"]
            selected_question_ids = []
            subject_config = []
            
            # Slice available subjects for this paper
            paper_subjects = available_subject_codes[config["start"]:config["end"]]
            
            # हर सब्जेक्ट से 4 सवाल चुनna
            for i, sub_code in enumerate(paper_subjects):
                q_list = questions_by_subject[sub_code]
                if len(q_list) < 4:
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
                        "total_marks": len(picked) * 5,
                        "time_minutes": 15,
                        "order": i + 1 # Order within this paper starts from 1
                    })
 
            new_paper = Paper(
                paper_name=name,
                description=f"Standard 20-marks per subject paper for KPO department. Includes {len(subject_config)} subjects.",
                department_id=kpo_dept.id,
                test_level_id=fresher_level.id,
                subject_ids_data=subject_config,
                question_id=selected_question_ids,
                total_time=str(len(subject_config) * 15), 
                total_marks=len(selected_question_ids) * 5,
                is_active=True,
                created_by=admin_id,
                grade="Percentage",
                grade_settings=[
                    {"min": 0.0, "max": 34.99, "grade_label": GradeLabel.POOR.value},
                    {"min": 35.0, "max": 49.99, "grade_label": GradeLabel.BELOW_AVERAGE.value},
                    {"min": 50.0, "max": 64.99, "grade_label": GradeLabel.AVERAGE.value},
                    {"min": 65.0, "max": 79.99, "grade_label": GradeLabel.ABOVE_AVERAGE.value},
                    {"min": 80.0, "max": 89.99, "grade_label": GradeLabel.GOOD.value},
                    {"min": 90.0, "max": 100.0, "grade_label": GradeLabel.EXCELLENT.value}
                ]
            )
            db.add(new_paper)
            print(f"✅ Created {name}: {len(subject_config)} subjects | {len(selected_question_ids)} questions | Marks: {len(selected_question_ids) * 5}")

        # 7. Create 3 custom uniquely-named papers with exactly 2 questions of 5 marks per subject
        custom_paper_names = [
            "KPO Premier Comprehensive Paper X",
            "KPO Elite Assessment Paper Y",
            "KPO Ultimate Evaluation Paper Z"
        ]

        # Let's filter questions of exactly 5 marks grouped by subject
        questions_by_subject_5m = {}
        for q in all_questions:
            if q.marks == 5:
                if q.subject_type not in questions_by_subject_5m:
                    questions_by_subject_5m[q.subject_type] = []
                questions_by_subject_5m[q.subject_type].append(q)

        available_subject_codes_5m = list(questions_by_subject_5m.keys())

        for name in custom_paper_names:
            selected_question_ids = []
            subject_config = []

            for i, sub_code in enumerate(available_subject_codes_5m):
                q_list = questions_by_subject_5m[sub_code]
                if len(q_list) < 2:
                    picked = q_list
                else:
                    picked = random.sample(q_list, 2)

                selected_question_ids.extend([q.id for q in picked])

                # Get subject classification ID
                sub_obj = db.query(Classification).filter(
                    Classification.type == "subject",
                    Classification.code == sub_code
                ).first()

                if sub_obj:
                    subject_config.append({
                        "subject_id": sub_obj.id,
                        "is_selected": True,
                        "question_count": len(picked),
                        "total_marks": len(picked) * 5,
                        "time_minutes": 10,
                        "order": i + 1
                    })

            if not subject_config:
                continue

            custom_paper = Paper(
                paper_name=name,
                description=f"Premium unique paper featuring all available subjects under KPO. Includes {len(subject_config)} subjects with exactly 2 questions (5 marks each) per subject.",
                department_id=kpo_dept.id,
                test_level_id=fresher_level.id,
                subject_ids_data=subject_config,
                question_id=selected_question_ids,
                total_time=str(len(subject_config) * 10),
                total_marks=len(selected_question_ids) * 5,
                is_active=True,
                created_by=admin_id,
                grade="Percentage",
                grade_settings=[
                    {"min": 0.0, "max": 34.99, "grade_label": GradeLabel.POOR.value},
                    {"min": 35.0, "max": 49.99, "grade_label": GradeLabel.BELOW_AVERAGE.value},
                    {"min": 50.0, "max": 64.99, "grade_label": GradeLabel.AVERAGE.value},
                    {"min": 65.0, "max": 79.99, "grade_label": GradeLabel.ABOVE_AVERAGE.value},
                    {"min": 80.0, "max": 89.99, "grade_label": GradeLabel.GOOD.value},
                    {"min": 90.0, "max": 100.0, "grade_label": GradeLabel.EXCELLENT.value}
                ]
            )
            db.add(custom_paper)
            print(f"✅ Created {name}: {len(subject_config)} subjects | {len(selected_question_ids)} questions | Marks: {len(selected_question_ids) * 5}")

        db.commit()
        print("\n✨ Standardized & Custom Paper Seeding Complete!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during paper seeding: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_papers()
