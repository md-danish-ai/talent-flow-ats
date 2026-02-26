from fastapi import APIRouter, Depends, Request
from typing import Optional
from app.classifications.schemas import ClassificationCreate, ClassificationUpdate
from app.classifications.service import ClassificationService
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import require_roles

router = APIRouter(
    prefix="/classifications",
    tags=["Classifications"],
    dependencies=[Depends(require_roles(["admin"]))]
)
service = ClassificationService()


@router.get("/")
def get_all(
    # filter by: question_type | subject_type | exam_level
    type:      Optional[str] = None,
    is_active: Optional[bool] = None,
):
    data = service.get_all(type_filter=type, is_active=is_active)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.get("/{classification_id}")
def get_by_id(
    classification_id: int,
):
    data = service.get_by_id(classification_id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.post("/")
def create(payload: ClassificationCreate):
    data = service.create(payload)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put("/{classification_id}")
def update(
    classification_id: int,
    payload: ClassificationUpdate,
):
    data = service.update(classification_id, payload)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.delete("/{classification_id}")
def delete(
    classification_id: int,
):
    data = service.delete(classification_id)
    return api_response(StatusCode.OK, ResponseMessage.DELETED, data=data)
