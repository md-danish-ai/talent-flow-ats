from app.questions import repository
from fastapi import UploadFile
import os
from uuid import uuid4


from app.core.config import settings


class QuestionService:

    async def create_question(self, payload, user_id: int):
        return repository.create_question(payload, user_id)

    async def get_questions(
        self,
        question_type=None,
        subject=None,
        difficulty_level=None,
        is_active=None
    ):
        return repository.get_questions(
            question_type,
            subject,
            difficulty_level,
            is_active
        )

    async def update_question(self, question_id: int, payload, current_user: str):
        return repository.update_question_in_db(question_id, payload)

    async def delete_question(self, question_id: int, user_id: int):
        return repository.delete_question(question_id)

    def save_image(self, file: UploadFile) -> str:
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

        # Clean filename
        clean_name = file.filename.replace(" ", "_").replace("-", "_")

        filename = f"{uuid4().hex}_{clean_name}"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)

        with open(file_path, "wb") as f:
            f.write(file.file.read())

        return f"/images/{filename}"
