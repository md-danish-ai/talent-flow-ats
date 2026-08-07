# backend/scripts/generate_db_seed.py

import os
import sys
import json
from datetime import datetime, date

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.db import SessionLocal
from app.departments.models import Department
from app.classifications.models import Classification
from app.users.models import User
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.papers.models import Paper
from app.paper_assignments.models import AutoAssignmentRule

SEEDS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "seeds"
)
os.makedirs(SEEDS_DIR, exist_ok=True)


def export_departments(db):
    depts = db.query(Department).order_by(Department.id).all()
    data = [
        {
            "id": d.id,
            "name": d.name,
            "is_active": d.is_active,
            "requires_interview": d.requires_interview,
        }
        for d in depts
    ]

    content = f"""# ruff: noqa
# Auto-generated seed file from database on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.departments.models import Department

DEPARTMENTS_DATA = {json.dumps(data, indent=4)}

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
        print(f"✨ Departments seeding complete! Added: {{total_seeded}}, Updated: {{total_updated}}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding departments: {{str(e)}}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_departments()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_departments.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} ({len(data)} departments)")


def export_classifications(db):
    cls_list = db.query(Classification).order_by(Classification.id).all()
    data = [
        {
            "id": c.id,
            "type": c.type,
            "name": c.name,
            "code": c.code,
            "sort_order": c.sort_order,
            "metadata": c.extra_metadata,
            "is_active": c.is_active,
        }
        for c in cls_list
    ]

    content = f"""# ruff: noqa
# Auto-generated seed file from database on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.classifications.models import Classification

CLASSIFICATIONS_DATA = {json.dumps(data, indent=4)}

def seed_classifications():
    db = SessionLocal()
    try:
        print("🚀 Seeding classifications...")
        total_seeded = 0
        total_updated = 0

        for item in CLASSIFICATIONS_DATA:
            existing = db.query(Classification).filter(
                (Classification.type == item["type"]) & (Classification.code == item["code"])
            ).first()

            if existing:
                existing.name = item["name"]
                existing.sort_order = item.get("sort_order", 0)
                existing.extra_metadata = item.get("metadata")
                existing.is_active = item.get("is_active", True)
                total_updated += 1
            else:
                cls_obj = Classification(
                    id=item["id"],
                    type=item["type"],
                    name=item["name"],
                    code=item["code"],
                    sort_order=item.get("sort_order", 0),
                    extra_metadata=item.get("metadata"),
                    is_active=item.get("is_active", True),
                )
                db.add(cls_obj)
                total_seeded += 1

        db.commit()
        print(f"✨ Classifications seeding complete! Added: {{total_seeded}}, Updated: {{total_updated}}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding classifications: {{str(e)}}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_classifications()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_classifications.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} ({len(data)} classifications)")


def export_users(db):
    users = (
        db.query(User)
        .filter(User.role.in_(["admin", "project_lead"]))
        .order_by(User.id)
        .all()
    )
    data = [
        {
            "id": u.id,
            "username": u.username,
            "mobile": u.mobile,
            "email": u.email,
            "password": u.password,
            "role": u.role,
            "test_level_id": u.test_level_id,
            "department_id": u.department_id,
            "is_active": u.is_active,
            "process_status": u.process_status,
        }
        for u in users
    ]

    content = f"""# ruff: noqa
# Auto-generated seed file from database on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.users.models import User

USERS_DATA = {json.dumps(data, indent=4)}

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
        print(f"✨ Users seeding complete! Added: {{total_seeded}}, Updated: {{total_updated}}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding users: {{str(e)}}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_users.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} ({len(data)} users)")


def export_questions(db):
    questions = db.query(Question).order_by(Question.id).all()
    data = []

    for q in questions:
        ans = (
            db.query(QuestionAnswer).filter(QuestionAnswer.question_id == q.id).first()
        )
        opts = q.options
        if q.question_type == "LEAD_GENERATION" and isinstance(opts, dict):
            opts = {
                k: v
                for k, v in opts.items()
                if k
                in {"company_name", "website", "contact_name", "designation", "email"}
            }

        data.append(
            {
                "id": q.id,
                "question_type": q.question_type,
                "subject_type": q.subject_type,
                "exam_level": q.exam_level,
                "question_text": q.question_text,
                "image_url": q.image_url,
                "passage": q.passage,
                "marks": q.marks,
                "options": opts,
                "is_active": q.is_active,
                "created_by": q.created_by,
                "answer_text": ans.answer_text if ans else "",
                "explanation": ans.explanation if ans else "",
            }
        )

    content = f"""# ruff: noqa
# Auto-generated seed file from database on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from sqlalchemy.orm.attributes import flag_modified

QUESTIONS_DATA = {json.dumps(data, indent=4)}

def seed_questions():
    db = SessionLocal()
    try:
        print("🚀 Seeding questions...")
        total_seeded = 0
        total_updated = 0

        for item in QUESTIONS_DATA:
            existing = db.query(Question).filter(Question.id == item["id"]).first()

            if existing:
                existing.question_type = item["question_type"]
                existing.subject_type = item["subject_type"]
                existing.exam_level = item["exam_level"]
                existing.question_text = item["question_text"]
                existing.image_url = item.get("image_url")
                existing.passage = item.get("passage")
                existing.marks = item.get("marks", 5)
                existing.options = item.get("options")
                flag_modified(existing, "options")
                existing.is_active = item.get("is_active", True)
                
                # Update Answer
                ans = db.query(QuestionAnswer).filter(QuestionAnswer.question_id == existing.id).first()
                if ans:
                    ans.answer_text = item.get("answer_text", "")
                    ans.explanation = item.get("explanation", "")
                else:
                    new_ans = QuestionAnswer(
                        question_id=existing.id,
                        answer_text=item.get("answer_text", ""),
                        explanation=item.get("explanation", ""),
                        created_by=item.get("created_by", 1),
                    )
                    db.add(new_ans)
                total_updated += 1
            else:
                q_obj = Question(
                    id=item["id"],
                    question_type=item["question_type"],
                    subject_type=item["subject_type"],
                    exam_level=item["exam_level"],
                    question_text=item["question_text"],
                    image_url=item.get("image_url"),
                    passage=item.get("passage"),
                    marks=item.get("marks", 5),
                    options=item.get("options"),
                    is_active=item.get("is_active", True),
                    created_by=item.get("created_by", 1),
                )
                db.add(q_obj)
                db.flush()

                new_ans = QuestionAnswer(
                    question_id=q_obj.id,
                    answer_text=item.get("answer_text", ""),
                    explanation=item.get("explanation", ""),
                    created_by=item.get("created_by", 1),
                )
                db.add(new_ans)
                total_seeded += 1

        db.commit()
        print(f"✨ Questions seeding complete! Added: {{total_seeded}}, Updated: {{total_updated}}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding questions: {{str(e)}}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_questions()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_questions.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} ({len(data)} questions & answers)")


def export_papers(db):
    papers = db.query(Paper).order_by(Paper.id).all()
    data = [
        {
            "id": p.id,
            "paper_name": p.paper_name,
            "description": p.description,
            "department_id": p.department_id,
            "test_level_id": p.test_level_id,
            "subject_ids_data": p.subject_ids_data,
            "question_id": p.question_id,
            "total_time": p.total_time,
            "total_marks": p.total_marks,
            "is_active": p.is_active,
            "grade": p.grade,
            "grade_settings": p.grade_settings,
            "created_by": p.created_by,
        }
        for p in papers
    ]

    content = f"""# ruff: noqa
# Auto-generated seed file from database on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.papers.models import Paper

PAPERS_DATA = {json.dumps(data, indent=4)}

def seed_papers():
    db = SessionLocal()
    try:
        print("🚀 Seeding papers...")
        total_seeded = 0
        total_updated = 0

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
                    created_by=item.get("created_by", 1),
                )
                db.add(paper)
                total_seeded += 1

        db.commit()
        print(f"✨ Papers seeding complete! Added: {{total_seeded}}, Updated: {{total_updated}}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding papers: {{str(e)}}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_papers()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_papers.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} ({len(data)} papers)")


def export_auto_rules(db):
    rules = db.query(AutoAssignmentRule).order_by(AutoAssignmentRule.id).all()
    data = [
        {
            "id": r.id,
            "department_id": r.department_id,
            "test_level_id": r.test_level_id,
            "assigned_date": r.assigned_date.strftime("%Y-%m-%d")
            if isinstance(r.assigned_date, (date, datetime))
            else str(r.assigned_date),
            "paper_ids": r.paper_ids,
            "is_active": r.is_active,
            "created_by": r.created_by,
        }
        for r in rules
    ]

    content = f"""# ruff: noqa
# Auto-generated seed file from database on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

true = True
false = False
null = None

from app.database.db import SessionLocal
from app.paper_assignments.models import AutoAssignmentRule

AUTO_RULES_DATA = {json.dumps(data, indent=4)}

def seed_auto_rules():
    db = SessionLocal()
    try:
        print("🚀 Seeding auto assignment rules...")
        total_seeded = 0
        total_updated = 0

        for item in AUTO_RULES_DATA:
            existing = db.query(AutoAssignmentRule).filter(AutoAssignmentRule.id == item["id"]).first()

            assigned_date_val = datetime.strptime(item["assigned_date"], "%Y-%m-%d").date() if isinstance(item["assigned_date"], str) else item["assigned_date"]

            if existing:
                existing.department_id = item["department_id"]
                existing.test_level_id = item["test_level_id"]
                existing.assigned_date = assigned_date_val
                existing.paper_ids = item["paper_ids"]
                existing.is_active = item.get("is_active", True)
                total_updated += 1
            else:
                rule = AutoAssignmentRule(
                    id=item["id"],
                    department_id=item["department_id"],
                    test_level_id=item["test_level_id"],
                    assigned_date=assigned_date_val,
                    paper_ids=item["paper_ids"],
                    is_active=item.get("is_active", True),
                    created_by=item.get("created_by", 1),
                )
                db.add(rule)
                total_seeded += 1

        db.commit()
        print(f"✨ Auto assignment rules seeding complete! Added: {{total_seeded}}, Updated: {{total_updated}}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding auto rules: {{str(e)}}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_auto_rules()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_auto_rules.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} ({len(data)} auto assignment rules)")


def export_seed_all():
    content = f"""# ruff: noqa
# Auto-generated master seed runner on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from seeds.seed_departments import seed_departments
from seeds.seed_classifications import seed_classifications
from seeds.seed_users import seed_users
from seeds.seed_questions import seed_questions
from seeds.seed_papers import seed_papers
from seeds.seed_auto_rules import seed_auto_rules

def seed_all():
    print("==================================================")
    print("🌱 STARTING FULL DATABASE SEEDING PROCESS")
    print("==================================================")
    
    seed_departments()
    seed_classifications()
    seed_users()
    seed_questions()
    seed_papers()
    seed_auto_rules()

    print("==================================================")
    print("🎉 ALL SEEDS COMPLETED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    seed_all()
"""
    file_path = os.path.join(SEEDS_DIR, "seed_all.py")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Generated {file_path} (Master seed runner)")


def main():
    db = SessionLocal()
    try:
        print("📥 Dumping DB data and generating seed files...")
        export_departments(db)
        export_classifications(db)
        export_users(db)
        export_questions(db)
        export_papers(db)
        export_auto_rules(db)
        export_seed_all()
        print("\n✨ All seed files generated successfully in backend/seeds/!")
    finally:
        db.close()


if __name__ == "__main__":
    main()
