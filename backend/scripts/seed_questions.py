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
        user_id = admin_user.id if admin_user else None

        print(f"Using User ID: {user_id} for 'created_by'")

        question_types = [
            "MULTIPLE_CHOICE",
            "IMAGE_MULTIPLE_CHOICE",
            "SUBJECTIVE",
            "IMAGE_SUBJECTIVE",
            "PASSAGE_CONTENT",
        ]

        # Valid codes from classifications (based on your frontend constants)
        subjects = ["LOGICAL", "MATH'S", "ENGLISH", "GRAMMER"]
        levels = ["FRESHER", "QA", "TEAMLEAD"]

        for q_type in question_types:
            print(f"Seeding 10 questions for type: {q_type}")
            for i in range(1, 11):
                subject = subjects[i % len(subjects)]
                level = levels[i % len(levels)]

                # Prepare Question Data
                q_text = f"Sample {q_type} Question #{i}: What is the logical outcome of scenario {i}?"
                passage = None
                options = []
                ans_text = ""
                explanation = f"This is a detailed explanation for question #{i} of type {q_type}."

                if q_type == "MULTIPLE_CHOICE" or q_type == "IMAGE_MULTIPLE_CHOICE":
                    options = [
                        {
                            "option_label": "A",
                            "option_text": f"Option A for {q_type} {i}",
                            "is_correct": i % 4 == 1,
                        },
                        {
                            "option_label": "B",
                            "option_text": f"Option B for {q_type} {i}",
                            "is_correct": i % 4 == 2,
                        },
                        {
                            "option_label": "C",
                            "option_text": f"Option C for {q_type} {i}",
                            "is_correct": i % 4 == 3,
                        },
                        {
                            "option_label": "D",
                            "option_text": f"Option D for {q_type} {i}",
                            "is_correct": i % 4 == 0,
                        },
                    ]
                    ans_text = next(
                        (opt["option_label"] for opt in options if opt["is_correct"]),
                        "A",
                    )
                elif q_type == "SUBJECTIVE":
                    ans_text = f"This is the model subjective answer for {subject} question {i}. It should be comprehensive."
                elif q_type == "IMAGE_SUBJECTIVE":
                    ans_text = (
                        f"Analysis of the visual data in {subject} image question {i}."
                    )
                elif q_type == "PASSAGE_CONTENT":
                    passage = f"This is a sample passage paragraph for question {i}. It describes a scenario where {subject} skills are applied to solve a specific problem in a {level} level context."
                    q_text = f"According to the passage, what is the best approach for task {i}?"
                    ans_text = f"The best approach involves careful analysis of the {subject} factors described in section {i}."

                # Create Question
                new_q = Question(
                    question_type=q_type,
                    subject_type=subject,
                    exam_level=level,
                    question_text=q_text,
                    passage=passage,
                    marks=i if i <= 5 else 5,
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

            db.commit()
            print(f"Successfully seeded {q_type}")

        print("Seeding completed successfully!")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
