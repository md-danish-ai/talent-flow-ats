from app.questions import repository
from fastapi import UploadFile, HTTPException
import os
from uuid import uuid4
from app.core.config import settings
from app.utils.status_codes import StatusCode


class QuestionService:

    async def create_question(self, payload, user_id: int):
        try:
            return repository.create_question(payload, user_id)
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    async def get_questions(self, question_type=None, subject=None, difficulty_level=None, is_active=None):
        try:
            return repository.get_questions(question_type, subject, difficulty_level, is_active)
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    async def update_question(self, question_id: int, payload, current_user: str):
        try:
            return repository.update_question_in_db(question_id, payload)
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    async def delete_question(self, question_id: int, user_id: int):
        try:
            return repository.delete_question(question_id)
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    def save_image(self, file: UploadFile) -> str:
        try:
            os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
            clean_name = file.filename.replace(" ", "_").replace("-", "_")
            filename = f"{uuid4().hex}_{clean_name}"
            file_path = os.path.join(settings.UPLOAD_DIR, filename)
            with open(file_path, "wb") as f:
                f.write(file.file.read())
            return f"/images/{filename}"
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))
