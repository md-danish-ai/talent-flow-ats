from fastapi import APIRouter, Depends
from app.answer import schemas
from app.answer.service import AnswerService
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import authenticate_user

router = APIRouter(
    prefix="/answers",
    tags=["Answers"],
    dependencies=[Depends(authenticate_user)]
)
answer_service = AnswerService()


@router.post("/")
async def create_answer(
    payload: schemas.AnswerCreate, current_user: int = Depends(authenticate_user)
):
    data = await answer_service.create_answer(payload, current_user)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.get("/{question_id}")
async def get_answer(question_id: int):
    data = await answer_service.get_answer(question_id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.put("/{question_id}")
async def update_answer(
    question_id: int,
    payload: schemas.AnswerUpdate,
    current_user: int = Depends(authenticate_user),
):
    data = await answer_service.update_answer(question_id, payload, current_user)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)
