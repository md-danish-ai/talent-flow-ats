from fastapi import APIRouter, Depends, Query

from app.utils.dependencies import authenticate_user, require_roles
from app.utils.status_codes import ResponseMessage, StatusCode, api_response
from .schemas import SaveAttemptAnswerRequest, StartAttemptRequest, ManualMarksRequest, ResetSubjectsRequest, BatchSaveAnswersRequest
from .service import InterviewAttemptService

router = APIRouter(
    tags=["Interview Attempts"],
    dependencies=[Depends(authenticate_user)],
)
service = InterviewAttemptService()


@router.post("/user/interview-attempts/start-new-attempt")
async def start_attempt(
    payload: StartAttemptRequest,
    current_user: int = Depends(authenticate_user),
):
    data = await service.start_attempt(paper_id=payload.paper_id, user_id=current_user)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put("/user/interview-attempts/save-answer/{attempt_id}/{question_id}")
async def save_answer(
    attempt_id: int,
    question_id: int,
    payload: SaveAttemptAnswerRequest,
    current_user: int = Depends(authenticate_user),
):
    data = await service.save_answer(
        attempt_id=attempt_id,
        question_id=question_id,
        user_id=current_user,
        answer_text=payload.answer_text,
        is_auto_saved=payload.is_auto_saved,
    )
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.post("/user/interview-attempts/save-answers-batch/{attempt_id}")
async def save_answers_batch(
    attempt_id: int,
    payload: BatchSaveAnswersRequest,
    current_user: int = Depends(authenticate_user),
):
    data = await service.save_answers_batch(
        attempt_id=attempt_id,
        user_id=current_user,
        answers=[a.dict() for a in payload.answers],
    )
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.post("/user/interview-attempts/submit-attempt/{attempt_id}")
async def submit_attempt(
    attempt_id: int,
    current_user: int = Depends(authenticate_user),
):
    data = await service.submit_attempt(attempt_id=attempt_id, user_id=current_user)
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post("/user/interview-attempts/auto-submit-attempt/{attempt_id}")
async def auto_submit_attempt(
    attempt_id: int,
    current_user: int = Depends(authenticate_user),
):
    data = await service.auto_submit_attempt(
        attempt_id=attempt_id, user_id=current_user
    )
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.get("/user/interview-attempts/get-attempt-summary/{attempt_id}")
async def get_attempt_summary(
    attempt_id: int,
    current_user: int = Depends(authenticate_user),
):
    data = await service.get_summary(attempt_id=attempt_id, user_id=current_user)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.get(
    "/admin/results/get-all-results",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def get_admin_user_results(
    search: str | None = Query(default=None),
    start_date: str | None = Query(default=None),
    end_date: str | None = Query(default=None),
    status: str | None = Query(default=None),
    completion_reason: str | None = Query(default=None),
    overall_grade: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
):
    data = await service.get_admin_user_results(
        search=search,
        start_date=start_date,
        end_date=end_date,
        status=status,
        completion_reason=completion_reason,
        overall_grade=overall_grade,
        page=page,
        limit=limit,
    )
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.get(
    "/admin/results/user-result-details/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def get_admin_user_result_detail(
    user_id: int,
    attempt_id: int | None = Query(default=None),
):
    data = await service.get_admin_user_result_detail(
        user_id=user_id,
        attempt_id=attempt_id,
    )
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.get(
    "/admin/results/user-attempt-history/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def get_admin_user_attempts(
    user_id: int,
):
    data = await service.get_admin_user_attempts(user_id=user_id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.post(
    "/admin/results/reset-today-attempt/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def reset_user_today_attempt(
    user_id: int,
):
    data = await service.reset_user_today_attempt(user_id=user_id)
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post(
    "/admin/results/clear-user-details/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def reset_user_details(
    user_id: int,
):
    data = await service.reset_user_details(user_id=user_id)
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post(
    "/admin/results/enable-reinterview/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def enable_reinterview(
    user_id: int,
):
    data = await service.reset_user_for_reinterview(user_id=user_id)
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post(
    "/admin/results/manual-marks/{user_id}/{attempt_id}/{question_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def assign_manual_marks(
    user_id: int,
    attempt_id: int,
    question_id: int,
    payload: ManualMarksRequest,
):
    data = await service.assign_manual_marks(
        user_id=user_id,
        attempt_id=attempt_id,
        question_id=question_id,
        marks=payload.marks,
    )
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post(
    "/admin/results/reset-user-subjects/{user_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
async def reset_user_subjects(
    user_id: int,
    payload: ResetSubjectsRequest,
):
    data = await service.reset_user_subjects(
        user_id=user_id,
        attempt_id=payload.attempt_id,
        section_names=payload.section_names,
    )
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post("/user/interview-attempts/skip-section/{attempt_id}/{section_name}")
async def skip_section(
    attempt_id: int,
    section_name: str,
    current_user: int = Depends(authenticate_user),
):
    data = await service.skip_section(
        attempt_id=attempt_id, user_id=current_user, section_name=section_name
    )
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.get("/user/interview-attempts/check-active-status")
async def get_active_status(
    current_user: int = Depends(authenticate_user),
):
    data = await service.get_active_attempt_status(user_id=current_user)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)
