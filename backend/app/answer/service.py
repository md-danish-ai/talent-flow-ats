from app.answer import repository
from fastapi import HTTPException
from app.utils.status_codes import StatusCode


class AnswerService:

    async def create_answer(self, payload, user_id: int):
        try:
            return repository.create_answer(payload, user_id)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    async def get_answer(self, question_id: int):
        try:
            return repository.get_answer_by_question(question_id)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    async def update_answer(self, question_id: int, payload, user_id: int):
        try:
            return repository.update_answer(question_id, payload, user_id)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))
