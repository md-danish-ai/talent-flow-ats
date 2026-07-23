from fastapi import APIRouter, Depends
from typing import Optional
from app.classifications.schemas import (
    ClassificationCreate,
    ClassificationUpdate,
    ClassificationReorderRequest,
)
from app.classifications.service import ClassificationService
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import require_roles
from app.utils.pagination import (
    PaginationParams,
    get_pagination_params,
    create_paginated_response,
)

router = APIRouter(
    prefix="/classifications",
    tags=["Classifications"],
)
service = ClassificationService()


@router.get("/get-classifications")
def get_all(
    type: Optional[str] = None,
    is_active: Optional[bool] = None,
    sort_by: Optional[str] = None,
    order: Optional[str] = None,
    pagination: PaginationParams = Depends(get_pagination_params),
):
    offset = (pagination.page - 1) * pagination.limit
    actual_sort_by = sort_by or (
        pagination.sort_by if pagination.sort_by != "created_at" else "sort_order"
    )
    actual_order = order or (
        pagination.order if pagination.sort_by != "created_at" else "asc"
    )

    data, total_records = service.get_all(
        type_filter=type,
        is_active=is_active,
        search=pagination.search,
        sort_by=actual_sort_by,
        order=actual_order,
        limit=pagination.limit,
        offset=offset,
    )
    paginated_data = create_paginated_response(data, total_records, pagination)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=paginated_data)


@router.post("/create-classification", dependencies=[Depends(require_roles(["admin"]))])
def create(payload: ClassificationCreate):
    data = service.create(payload)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put(
    "/update-classification/{classification_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
def update(
    classification_id: int,
    payload: ClassificationUpdate,
):
    data = service.update(classification_id, payload)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.put(
    "/reorder-classifications",
    dependencies=[Depends(require_roles(["admin"]))],
)
def reorder(payload: ClassificationReorderRequest):
    service.reorder([item.dict() for item in payload.items])
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED,
        data={"message": "Classifications reordered successfully"},
    )
