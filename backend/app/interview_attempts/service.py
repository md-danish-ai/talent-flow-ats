from fastapi import HTTPException

from app.utils.status_codes import StatusCode
from . import repository


class InterviewAttemptService:
    async def start_attempt(self, paper_id: int, user_id: int):
        try:
            return repository.start_attempt(paper_id=paper_id, user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def save_answer(
        self,
        attempt_id: int,
        question_id: int,
        user_id: int,
        answer_text: str | None,
        is_auto_saved: bool,
    ):
        try:
            return repository.save_answer(
                attempt_id=attempt_id,
                question_id=question_id,
                user_id=user_id,
                answer_text=answer_text,
                is_auto_saved=is_auto_saved,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def submit_attempt(self, attempt_id: int, user_id: int):
        try:
            return repository.finalize_attempt(
                attempt_id=attempt_id,
                user_id=user_id,
                status="submitted",
                completion_reason="manual",
                is_auto_submitted=False,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def auto_submit_attempt(self, attempt_id: int, user_id: int):
        try:
            return repository.finalize_attempt(
                attempt_id=attempt_id,
                user_id=user_id,
                status="auto_submitted",
                completion_reason="time_over",
                is_auto_submitted=True,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def get_summary(self, attempt_id: int, user_id: int):
        try:
            return repository.get_attempt_summary(
                attempt_id=attempt_id, user_id=user_id
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def get_admin_user_results(self, search: str | None = None):
        try:
            return repository.get_admin_user_results(search=search)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def get_admin_user_result_detail(
        self, user_id: int, attempt_id: int | None = None
    ):
        try:
            return repository.get_admin_user_result_detail(
                user_id=user_id,
                attempt_id=attempt_id,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def get_admin_user_attempts(self, user_id: int):
        try:
            return repository.get_admin_user_attempts(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def reset_user_today_attempt(self, user_id: int):
        try:
            return repository.reset_user_today_attempt(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )

    async def reset_user_details(self, user_id: int):
        try:
            return repository.reset_user_details(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(
                status_code=StatusCode.INTERNAL_SERVER_ERROR,
                detail=str(exception),
            )
