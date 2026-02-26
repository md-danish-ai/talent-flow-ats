from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, ConfigDict
from fastapi import Query
import math

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 10
    search: Optional[str] = None
    sort_by: Optional[str] = "created_at"
    order: Optional[str] = "desc"


def get_pagination_params(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search query"),
    sort_by: Optional[str] = Query(
        "created_at", description="Field to sort by"),
    order: Optional[str] = Query("desc", description="Sort order (asc/desc)"),
) -> PaginationParams:
    return PaginationParams(page=page, limit=limit, search=search, sort_by=sort_by, order=order)


class PaginationInfo(BaseModel):
    total_records: int
    total_pages: int
    current_page: int
    per_page: int
    has_next: bool
    has_previous: bool


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    pagination: PaginationInfo

    model_config = ConfigDict(from_attributes=True)


def create_paginated_response(
    data: List[T],
    total_records: int,
    params: PaginationParams
) -> dict:
    total_pages = math.ceil(
        total_records / params.limit) if params.limit > 0 else 0
    return {
        "data": data,
        "pagination": {
            "total_records": total_records,
            "total_pages": total_pages,
            "current_page": params.page,
            "per_page": params.limit,
            "has_next": params.page < total_pages,
            "has_previous": params.page > 1
        }
    }
