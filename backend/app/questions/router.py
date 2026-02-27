# app/questions/router.py

from fastapi import APIRouter, Depends, File, UploadFile
from typing import Optional
from . import schemas
from app.questions.service import QuestionService
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import authenticate_user
from app.utils.pagination import PaginationParams, get_pagination_params, create_paginated_response

router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
    dependencies=[Depends(authenticate_user)]
)
question_service = QuestionService()


@router.get("/get")
async def get_questions(
    question_type: Optional[str] = None,
    subject_type:  Optional[str] = None,
    exam_level:    Optional[str] = None,
    is_active:     Optional[bool] = None,
    pagination:    PaginationParams = Depends(get_pagination_params),
):
    offset = (pagination.page - 1) * pagination.limit
    data, total_records = await question_service.get_questions(
        question_type=question_type,
        subject_type=subject_type,
        exam_level=exam_level,
        is_active=is_active,
        search=pagination.search,
        sort_by=pagination.sort_by,
        order=pagination.order,
        limit=pagination.limit,
        offset=offset
    )

    paginated_data = create_paginated_response(data, total_records, pagination)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=paginated_data)


@router.get("/get/{question_id}")
async def get_question(
    question_id:  int,
):
    data = await question_service.get_question_by_id(question_id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.post("/create")
async def create_question(
    payload:      schemas.QuestionCreate,
    current_user: int = Depends(authenticate_user)
):
    data = await question_service.create_question(payload, current_user)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put("/update/{question_id}")
@router.patch("/update/{question_id}")
async def update_question(
    question_id:  int,
    payload:      schemas.QuestionUpdate,
    current_user: int = Depends(authenticate_user)
):
    data = await question_service.update_question(question_id, payload, current_user)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.patch("/toggle/{question_id}")
async def toggle_question_status(
    question_id:  int,
):
    data = await question_service.toggle_question_status(question_id)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)

@router.delete("/{question_id}")
async def delete_question(
    question_id:  int,
    current_user: int = Depends(authenticate_user)
):
    data = await question_service.delete_question(question_id, current_user)
    return api_response(StatusCode.OK, ResponseMessage.DELETED, data=data)


@router.post("/upload-image")
async def upload_image(
    image:        UploadFile = File(...),
):
    image_url = question_service.save_image(image)
    return api_response(StatusCode.OK, "Image uploaded successfully", data={"image_url": image_url})
