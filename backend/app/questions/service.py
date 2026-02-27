# app/questions/service.py

from app.questions import repository
from app.classifications import repository as classification_repo
from fastapi import UploadFile, HTTPException
import os
from uuid import uuid4
from app.core.config import settings
from app.utils.status_codes import StatusCode


class QuestionService:

    def _validate_classification_code(self, code: str, expected_type: str):
        """Ensure the classification code exists and belongs to the correct type."""
        if code is None:
            return
        record = classification_repo.get_by_code_and_type(code, expected_type)
        if not record:
            raise HTTPException(
                status_code=StatusCode.BAD_REQUEST,
                detail=f"Classification code '{code}' not found for type '{expected_type}'"
            )

    async def create_question(self, payload, user_id: int):
        try:
            # Validate Codes
            self._validate_classification_code(
                payload.question_type, "question_type")
            self._validate_classification_code(
                payload.subject_type, "subject_type")
            self._validate_classification_code(
                payload.exam_level, "exam_level")

            return repository.create_question(
                payload,
                payload.question_type,
                payload.subject_type,
                payload.exam_level,
                user_id
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_questions(
        self,
        question_type: str = None,
        subject_type:  str = None,
        exam_level:    str = None,
        is_active:     bool = None,
        search:        str = None,
        sort_by:       str = "created_at",
        order:         str = "desc",
        limit:         int = 10,
        offset:        int = 0
    ):
        try:
            return repository.get_questions(
                question_type=question_type,
                subject_type=subject_type,
                exam_level=exam_level,
                is_active=is_active,
                search=search,
                sort_by=sort_by,
                order=order,
                limit=limit,
                offset=offset
            )
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def get_question_by_id(self, question_id: int):
        try:
            result = repository.get_question_by_id(question_id)
            if not result:
                raise HTTPException(
                    status_code=StatusCode.NOT_FOUND, detail="Question not found")
            return result
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    async def update_question(self, question_id: int, payload, current_user: int):
        try:
            # Validate Codes (only if provided)
            if payload.question_type:
                self._validate_classification_code(
                    payload.question_type, "question_type")
            if payload.subject_type:
                self._validate_classification_code(
                    payload.subject_type, "subject_type")
            if payload.exam_level:
                self._validate_classification_code(
                    payload.exam_level, "exam_level")

            return repository.update_question(
                question_id,
                payload,
                payload.question_type,
                payload.subject_type,
                payload.exam_level
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def delete_question(self, question_id: int, user_id: int):
        try:
            return repository.delete_question(question_id)
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e)
            )

    async def toggle_question_status(self, question_id: int):
        try:
            return repository.toggle_question_status(question_id)
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e)
            )

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
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e)
            )
