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
from app.database.db import SessionLocal

def seed_data():
    db = SessionLocal()
    try:
        # Check if user 1 exists, if not use None or find a user
        admin_user = db.query(User).first()
        user_id = admin_user.id if admin_user else 1

        print(f"Using User ID: {user_id} for 'created_by'")

        # Question types from classification
        question_types = [
            "MULTIPLE_CHOICE",
            "IMAGE_MULTIPLE_CHOICE",
            "SUBJECTIVE",
            "IMAGE_SUBJECTIVE",
            "PASSAGE_CONTENT",
        ]

        # All subjects from official classification list
        subjects = [
            "APTITUDE",
            "BRAND_AWARENESS",
            "COMPANY_CONTACT_DETAILS",
            "COMPANY_DETAILS",
            "COMPREHENSION",
            "DATA_INTERPRETATION_ANALYTICS",
            "ENGLISH",
            "EXCEL",
            "FOOD_INDUSTRY",
            "GRAMMAR",
            "INDUSTRY_AWARENESS",
            "LEAD_GENERATION",
            "REAL_ESTATE",
            "TYPING_TEST",
            "WRITTEN",
            "E_COMMERCE_ONLINE_SHOPPING",
        ]
        
        # All questions set to FRESHER as requested
        level = "FRESHER"

        total_seeded = 0
        total_skipped = 0
        
        # We process each question type
        for q_type in question_types:
            print(f"Seeding questions for type: {q_type}")
            # For each subject
            for subject in subjects:
                # Create 5 questions as requested
                for i in range(1, 6):
                    # Prepare Question Data
                    q_text = f"Sample {q_type} Question #{i} for Subject {subject.replace('_', ' ').capitalize()}: What is a key concept in {subject.lower().replace('_', ' ')}?"
                    
                    # --- DUPLICATE CHECK ---
                    # Check if a question with same type, subject, and text already exists
                    existing = db.query(Question).filter(
                        Question.question_type == q_type,
                        Question.subject_type == subject,
                        Question.question_text == q_text
                    ).first()

                    if existing:
                        total_skipped += 1
                        continue
                    # -----------------------

                    passage = None
                    options = []
                    ans_text = ""
                    explanation = f"This is a detailed explanation for {subject} question #{i} of type {q_type}."

                    if q_type == "MULTIPLE_CHOICE" or q_type == "IMAGE_MULTIPLE_CHOICE":
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

                        # Re-check for passage questions because their text is updated
                        existing_passage_q = db.query(Question).filter(
                            Question.question_type == q_type,
                            Question.subject_type == subject,
                            Question.question_text == q_text
                        ).first()
                        if existing_passage_q:
                            total_skipped += 1
                            continue

                    # Create Question
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
                    db.flush()  # Get ID

                    # Create Answer
                    new_ans = QuestionAnswer(
                        question_id=new_q.id,
                        answer_text=ans_text,
                        explanation=explanation,
                        created_by=user_id,
                    )
                    db.add(new_ans)
                    total_seeded += 1

            db.commit()
            print(f"Processed type: {q_type}")

        print(f"Seeding completed successfully!")
        print(f"Questions added: {total_seeded}")
        print(f"Questions skipped (already exist): {total_skipped}")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
