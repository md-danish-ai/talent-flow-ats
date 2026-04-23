# ruff: noqa
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

# Import ALL models to ensure SQLAlchemy knows about them for Foreign Keys
from app.users.models import User
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.classifications.models import Classification
from app.departments.models import Department
from app.database.db import SessionLocal

def seed_data():
    db = SessionLocal()
    try:
        # Check if user 1 exists, if not use None or find a user
        admin_user = db.query(User).first()
        user_id = admin_user.id if admin_user else 1

        print(f"Using User ID: {user_id} for 'created_by'")

        # ─────────────────────────────────────────────────────────────────
        # REGULAR question types (MCQ, Subjective, etc.)
        # These are seeded across ALL general subjects
        # ─────────────────────────────────────────────────────────────────
        question_types = [
            "MULTIPLE_CHOICE",
            "IMAGE_MULTIPLE_CHOICE",
            "SUBJECTIVE",
            "IMAGE_SUBJECTIVE",
            "PASSAGE_CONTENT",
        ]

        # General subjects only (special subjects handled separately below)
        subjects = [
            "APTITUDE",
            "BRAND_AWARENESS",
            "COMPREHENSION",
            "DATA_INTERPRETATION_ANALYTICS",
            "ENGLISH",
            "EXCEL",
            "FOOD_INDUSTRY",
            "GRAMMAR",
            "INDUSTRY_AWARENESS",
            "REAL_ESTATE",
            "WRITTEN",
            "E_COMMERCE_ONLINE_SHOPPING",
        ]
        
        # All questions set to FRESHER as requested
        level = "FRESHER"

        total_seeded = 0
        total_skipped = 0
        
        # Process regular question types across general subjects
        for q_type in question_types:
            print(f"\nSeeding questions for type: {q_type}")
            for subject in subjects:
                for i in range(1, 6):
                    q_text = f"Sample {q_type} Question #{i} for Subject {subject.replace('_', ' ').capitalize()}: What is a key concept in {subject.lower().replace('_', ' ')}?"
                    
                    existing = db.query(Question).filter(
                        Question.question_type == q_type,
                        Question.subject_type == subject,
                        Question.question_text == q_text
                    ).first()

                    if existing:
                        total_skipped += 1
                        continue

                    passage = None
                    options = []
                    ans_text = ""
                    explanation = f"This is a detailed explanation for {subject} question #{i} of type {q_type}."

                    if q_type in ("MULTIPLE_CHOICE", "IMAGE_MULTIPLE_CHOICE"):
                        options = [
                            {"option_label": "A", "option_text": f"Option A for {subject} {i}", "is_correct": i % 4 == 1},
                            {"option_label": "B", "option_text": f"Option B for {subject} {i}", "is_correct": i % 4 == 2},
                            {"option_label": "C", "option_text": f"Option C for {subject} {i}", "is_correct": i % 4 == 3},
                            {"option_label": "D", "option_text": f"Option D for {subject} {i}", "is_correct": i % 4 == 0},
                        ]
                        ans_text = next((opt["option_label"] for opt in options if opt["is_correct"]), "A")
                    elif q_type == "SUBJECTIVE":
                        ans_text = f"This is the model subjective answer for {subject} question {i}. It provides a comprehensive analysis of the topic."
                    elif q_type == "IMAGE_SUBJECTIVE":
                        ans_text = f"Analytical breakdown of the visual data provided in the {subject} image question {i}."
                    elif q_type == "PASSAGE_CONTENT":
                        passage = f"This is a sample passage for {subject} regarding concept {i}. It describes the fundamental principles and their applications in a {level} level environment."
                        q_text = f"Based on the provided passage, what is the best strategy for handling {subject} scenario {i}?"
                        ans_text = f"The best strategy involves identifying the {subject} variables mentioned in the passage and addressing them sequentially."

                        existing_passage_q = db.query(Question).filter(
                            Question.question_type == q_type,
                            Question.subject_type == subject,
                            Question.question_text == q_text
                        ).first()
                        if existing_passage_q:
                            total_skipped += 1
                            continue

                    new_q = Question(
                        question_type=q_type,
                        subject_type=subject,
                        exam_level=level,
                        question_text=q_text,
                        passage=passage,
                        marks=5,
                        is_active=True,
                        options=options,
                        created_by=user_id,
                    )
                    db.add(new_q)
                    db.flush()

                    db.add(QuestionAnswer(
                        question_id=new_q.id,
                        answer_text=ans_text,
                        explanation=explanation,
                        created_by=user_id,
                    ))
                    total_seeded += 1

            db.commit()
            print(f"  ✅ Processed type: {q_type}")

        # ─────────────────────────────────────────────────────────────────
        # SPECIAL QUESTION TYPES — strict subject mapping enforced:
        #   LEAD_GENERATION   → subject: LEAD_GENERATION only
        #   CONTACT_DETAILS   → subject: COMPANY_CONTACT_DETAILS only
        #   TYPING_TEST       → subject: TYPING_TEST only
        # ─────────────────────────────────────────────────────────────────
        SPECIAL_TYPE_SUBJECT_MAP = {
            "LEAD_GENERATION": "LEAD_GENERATION",
            "CONTACT_DETAILS": "COMPANY_CONTACT_DETAILS",
            "TYPING_TEST":     "TYPING_TEST",
        }

        for q_type, subject in SPECIAL_TYPE_SUBJECT_MAP.items():
            print(f"\nSeeding special type: {q_type} → subject: {subject}")

            for i in range(1, 6):
                passage = None
                options = []
                ans_text = ""
                explanation = f"Sample {q_type} explanation for question #{i}."

                if q_type == "LEAD_GENERATION":
                    q_text = f"Sample Company {i}"
                    options = {
                        "companyName": f"Sample Company {i}",
                        "website": f"samplecompany{i}.com",
                        "name": f"Contact Person {i}",
                        "title": "Manager",
                        "email": f"contact{i}@samplecompany{i}.com",
                    }

                elif q_type == "CONTACT_DETAILS":
                    q_text = f"http://samplecompany{i}.com"
                    options = {
                        "websiteUrl": f"http://samplecompany{i}.com",
                        "companyName": f"Sample Corp {i}",
                        "streetAddress": f"{i}00 Main Street",
                        "city": "Sample City",
                        "state": "CA",
                        "zipCode": f"9000{i}",
                        "companyPhoneNumber": f"+1 555-000-000{i}",
                        "generalEmail": f"info@samplecompany{i}.com",
                        "facebookPage": f"https://www.facebook.com/samplecorp{i}/",
                    }

                elif q_type == "TYPING_TEST":
                    q_text = f"Typing Test Passage #{i}"
                    passage = (
                        f"This is a sample typing test passage number {i}. "
                        f"The candidate is expected to type this paragraph accurately and quickly. "
                        f"Typing speed and accuracy are both evaluated in this test."
                    )

                # Duplicate check
                existing = db.query(Question).filter(
                    Question.question_type == q_type,
                    Question.subject_type == subject,
                    Question.question_text == q_text,
                ).first()
                if existing:
                    total_skipped += 1
                    continue

                new_q = Question(
                    question_type=q_type,
                    subject_type=subject,
                    exam_level=level,
                    question_text=q_text,
                    passage=passage,
                    marks=5,
                    is_active=True,
                    options=options,
                    created_by=user_id,
                )
                db.add(new_q)
                db.flush()

                db.add(QuestionAnswer(
                    question_id=new_q.id,
                    answer_text=ans_text,
                    explanation=explanation,
                    created_by=user_id,
                ))
                total_seeded += 1
                print(f"  ✅ Added {q_type}: {q_text}")

            db.commit()
            print(f"  Processed special type: {q_type}")

        print(f"\nSeeding completed successfully!")
        print(f"Questions added: {total_seeded}")
        print(f"Questions skipped (already exist): {total_skipped}")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
