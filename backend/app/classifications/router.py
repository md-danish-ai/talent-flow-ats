# app/classifications/router.py

from fastapi import APIRouter, Depends
from typing import Optional
from app.classifications.schemas import ClassificationCreate, ClassificationUpdate
from app.classifications.service import ClassificationService
from app.auth.dependencies import get_current_user
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.pagination import PaginationParams, get_pagination_params, create_paginated_response

router = APIRouter(prefix="/classifications", tags=["Classifications"])
service = ClassificationService()


@router.get("/get")
def get_all(
    type:      Optional[str] = None,
    is_active: Optional[bool] = None,
    pagination: PaginationParams = Depends(get_pagination_params),
    current_user: int = Depends(get_current_user)
):
    offset = (pagination.page - 1) * pagination.limit
    data, total_records = service.get_all(
        type_filter=type,
        is_active=is_active,
        search=pagination.search,
        sort_by=pagination.sort_by,
        order=pagination.order,
        limit=pagination.limit,
        offset=offset
    )
    paginated_data = create_paginated_response(data, total_records, pagination)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=paginated_data)


@router.get("/get/{classification_id}")
def get_by_id(
    classification_id: int,
    current_user: int = Depends(get_current_user)
):
    data = service.get_by_id(classification_id)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.post("/create")
def create(payload: ClassificationCreate, current_user: int = Depends(get_current_user)):
    data = service.create(payload)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put("/update/{classification_id}")
def update(
    classification_id: int,
    payload: ClassificationUpdate,
    current_user: int = Depends(get_current_user)
):
    data = service.update(classification_id, payload)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.delete("/delete/{classification_id}")
def delete(
    classification_id: int,
    current_user: int = Depends(get_current_user)
):
    data = service.delete(classification_id)
    return api_response(StatusCode.OK, ResponseMessage.DELETED, data=data)
