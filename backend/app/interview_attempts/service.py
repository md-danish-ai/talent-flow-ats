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
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

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
                record_id=attempt_id,
                question_id=question_id,
                user_id=user_id,
                answer_text=answer_text,
                is_auto_saved=is_auto_saved,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def save_answers_batch(self, attempt_id: int, user_id: int, answers: list[dict]):
        try:
            return repository.save_answers_batch(
                record_id=attempt_id,
                user_id=user_id,
                answers=answers,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def submit_attempt(self, attempt_id: int, user_id: int):
        try:
            return repository.finalize_attempt(
                record_id=attempt_id,
                user_id=user_id,
                status="submitted",
                completion_reason="manual",
                is_auto_submitted=False,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def auto_submit_attempt(self, attempt_id: int, user_id: int):
        try:
            return repository.finalize_attempt(
                record_id=attempt_id,
                user_id=user_id,
                status="auto_submitted",
                completion_reason="time_over",
                is_auto_submitted=True,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def get_summary(self, attempt_id: int, user_id: int):
        try:
            return repository.get_attempt_summary(record_id=attempt_id, user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def get_admin_user_results(
        self,
        search: str | None = None,
        start_date: str | None = None,
        end_date: str | None = None,
        status: str | None = None,
        completion_reason: str | None = None,
        overall_grade: str | None = None,
        project_lead_id: int | None = None,
        page: int = 1,
        limit: int = 10,
    ):
        try:
            return repository.get_admin_user_results(
                search=search,
                start_date=start_date,
                end_date=end_date,
                status=status,
                completion_reason=completion_reason,
                overall_grade=overall_grade,
                project_lead_id=project_lead_id,
                page=page,
                limit=limit,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def get_admin_user_result_detail(self, user_id: int, attempt_id: int | None = None):
        try:
            return repository.get_admin_user_result_detail(user_id=user_id, attempt_id=attempt_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def get_admin_user_attempts(self, user_id: int):
        try:
            return repository.get_admin_user_attempts(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def reset_user_today_attempt(self, user_id: int):
        try:
            return repository.reset_user_today_attempt(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def reset_user_details(self, user_id: int):
        try:
            return repository.reset_user_details(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def reset_user_for_reinterview(self, user_id: int):
        try:
            return repository.reset_user_for_reinterview(user_id=user_id)
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def assign_manual_marks(self, user_id: int, attempt_id: int, question_id: int, marks: float):
        try:
            return repository.assign_manual_marks(
                user_id=user_id,
                record_id=attempt_id,
                question_id=question_id,
                marks=marks,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def reset_user_subjects(self, user_id: int, attempt_id: int, section_names: list[str]):
        try:
            return repository.reset_subject_responses(
                user_id=user_id,
                record_id=attempt_id,
                section_names=section_names,
            )
        except HTTPException:
            raise
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def skip_section(self, attempt_id: int, user_id: int, section_name: str):
        try:
            return repository.mark_subject_section_as_skipped(
                user_id=user_id,
                record_id=attempt_id,
                section_name=section_name,
            )
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    async def get_active_attempt_status(self, user_id: int):
        try:
            return repository.get_active_attempt_status(user_id=user_id)
        except Exception as exception:
            raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))
