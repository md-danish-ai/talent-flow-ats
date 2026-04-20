# ruff: noqa
import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set default env vars for DB
os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "5435")
os.environ.setdefault("DB_NAME", "talent_flow_ats")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "Pass2020NothingSpecial")

from app.database.db import SessionLocal
from app.questions.models import Question
from app.users.models import User
from app.classifications.models import Classification
from app.departments.models import Department


def update_images():
    db = SessionLocal()
    try:
        # 1. Find an existing image_url
        existing_q = db.query(Question).filter(Question.image_url.isnot(None)).first()
        if not existing_q:
            print("No existing question with an image found in the database.")
            return

        image_url = existing_q.image_url
        print(f"Found existing image_url: {image_url}")

        # 2. Update all IMAGE_MULTIPLE_CHOICE and IMAGE_SUBJECTIVE questions that don't have an image
        target_types = ["IMAGE_MULTIPLE_CHOICE", "IMAGE_SUBJECTIVE"]
        questions_to_update = (
            db.query(Question)
            .filter(
                Question.question_type.in_(target_types), Question.image_url.is_(None)
            )
            .all()
        )

        if not questions_to_update:
            print("No image-based questions found without an image.")
            return

        print(
            f"Updating {len(questions_to_update)} questions with the found image_url..."
        )
        for q in questions_to_update:
            q.image_url = image_url

        db.commit()
        print("Successfully updated all image-based questions!")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    update_images()
