from fastapi import APIRouter, Depends
from typing import Optional
from app.departments.schemas import DepartmentCreate, DepartmentUpdate
from app.departments.service import DepartmentService
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import require_roles
from app.utils.pagination import (
    PaginationParams,
    get_pagination_params,
    create_paginated_response,
)

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
)
service = DepartmentService()


@router.get("/get-departments")
def get_all(
    is_active: Optional[bool] = None,
    pagination: PaginationParams = Depends(get_pagination_params),
):
    offset = (pagination.page - 1) * pagination.limit
    data, total_records = service.get_all(
        is_active=is_active,
        search=pagination.search,
        limit=pagination.limit,
        offset=offset,
    )
    paginated_data = create_paginated_response(data, total_records, pagination)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=paginated_data)


@router.post("/create-department", dependencies=[Depends(require_roles(["admin"]))])
def create(payload: DepartmentCreate):
    data = service.create(payload)
    return api_response(StatusCode.CREATED, ResponseMessage.CREATED, data=data)


@router.put("/update-department/{department_id}", dependencies=[Depends(require_roles(["admin"]))])
def update(department_id: int, payload: DepartmentUpdate):
    data = service.update(department_id, payload)
    if not data:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    return api_response(StatusCode.OK, ResponseMessage.UPDATED, data=data)


@router.delete("/remove-department/{department_id}", dependencies=[Depends(require_roles(["admin"]))])
def delete(department_id: int):
    success = service.delete(department_id)
    if not success:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    return api_response(StatusCode.OK, ResponseMessage.DELETED)
