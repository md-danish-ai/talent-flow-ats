from fastapi import APIRouter, Depends, Query,File,Form,UploadFile
from . import schemas
from app.questions.service import QuestionService
from app.auth.dependencies import get_current_user
from typing import Optional 
from .schemas import QuestionCreate, QuestionUpdate


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
    return await question_service.get_questions(
        question_type,
        subject,
        difficulty_level,
        is_active
    )

@router.put("/{question_id}") 
async def update_question(
    question_id: int,
    payload: schemas.QuestionUpdate,
    current_user: str = Depends(get_current_user)
):
    return await question_service.update_question(question_id, payload, current_user)

@router.post("/upload-image")
async def upload_image(
    image: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    image_path = question_service.save_image(image)
    return {
        "message": "Image uploaded successfully",
        "image_url": image_path
    }
 

@router.delete("/{question_id}")
async def delete_question(
    question_id: int,
    current_user: str = Depends(get_current_user)
):
    return await question_service.delete_question(question_id, current_user)

@router.post("/")
async def create_question(
    payload: schemas.QuestionCreate,
    current_user: str = Depends(get_current_user)
):
    return await question_service.create_question(payload, current_user)


