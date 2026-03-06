from fastapi import APIRouter, Depends

from app.utils.dependencies import authenticate_user
from app.utils.status_codes import ResponseMessage, StatusCode, api_response
from .schemas import SaveAttemptAnswerRequest, StartAttemptRequest
from .service import InterviewAttemptService

router = APIRouter(
    prefix="/interview-attempts",
    tags=["Interview Attempts"],
    dependencies=[Depends(authenticate_user)],
)
service = InterviewAttemptService()


@router.post("/start")
async def start_attempt(
    payload: StartAttemptRequest,
    current_user: int = Depends(authenticate_user),
):
    data = await service.start_attempt(paper_id=payload.paper_id, user_id=current_user)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put("/{attempt_id}/answers/{question_id}")
@router.patch("/{attempt_id}/answers/{question_id}")
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


@router.post("/{attempt_id}/submit")
async def submit_attempt(
    attempt_id: int,
    current_user: int = Depends(authenticate_user),
):
    data = await service.submit_attempt(attempt_id=attempt_id, user_id=current_user)
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.post("/{attempt_id}/auto-submit")
async def auto_submit_attempt(
    attempt_id: int,
    current_user: int = Depends(authenticate_user),
):
    data = await service.auto_submit_attempt(attempt_id=attempt_id, user_id=current_user)
    return api_response(StatusCode.OK, ResponseMessage.SUCCESS, data=data)


@router.get("/{attempt_id}/summary")
async def get_attempt_summary(
    attempt_id: int,
    current_user: int = Depends(authenticate_user),
):
    data = await service.get_summary(attempt_id=attempt_id, user_id=current_user)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)
