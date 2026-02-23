from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from . import schemas
from app.questions.service import QuestionService
from app.auth.dependencies import get_current_user
from app.utils.status_codes import StatusCode, ResponseMessage, api_response

router = APIRouter(prefix="/questions", tags=["Questions"])
question_service = QuestionService()


@router.get("/")
async def get_questions(
    question_type: str = None,
    subject: str = None,
    difficulty_level: str = None,
    is_active: bool = None,
    current_user: str = Depends(get_current_user)
):
    data = await question_service.get_questions(question_type, subject, difficulty_level, is_active)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.put("/{question_id}")
async def update_question(
    question_id: int,
    payload: schemas.QuestionUpdate,
    current_user: str = Depends(get_current_user)
):
    data = await question_service.update_question(question_id, payload, current_user)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.post("/upload-image")
async def upload_image(
    image: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    image_url = question_service.save_image(image)
    return api_response(StatusCode.OK, "Image uploaded successfully", data={"image_url": image_url})


@router.delete("/{question_id}")
async def delete_question(
    question_id: int,
    current_user: str = Depends(get_current_user)
):
    data = await question_service.delete_question(question_id, current_user)
    return api_response(StatusCode.OK, ResponseMessage.DELETED, data=data)


@router.post("/")
async def create_question(
    payload: schemas.QuestionCreate,
    current_user: str = Depends(get_current_user)
):
    data = await question_service.create_question(payload, current_user)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)