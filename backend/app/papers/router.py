from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.papers import repository, schemas
from app.utils.status_codes import StatusCode, ResponseMessage, api_response
from app.utils.dependencies import authenticate_user
from app.utils.pagination import (
    PaginationParams,
    get_pagination_params,
    create_paginated_response,
)

router = APIRouter(
    prefix="/papers", tags=["Papers"], dependencies=[Depends(authenticate_user)]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/get")
def read_papers(
    pagination: PaginationParams = Depends(get_pagination_params),
    db: Session = Depends(get_db),
):
    offset = (pagination.page - 1) * pagination.limit
    papers, total_records = repository.get_papers(
        db, skip=offset, limit=pagination.limit
    )

    # Convert SQLAlchemy objects to Pydantic models and then to dicts for proper serialization
    paper_list = [
        schemas.PaperResponse.model_validate(paper).model_dump() for paper in papers
    ]

    paginated_data = create_paginated_response(paper_list, total_records, pagination)
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=paginated_data)


@router.get("/get/{paper_id}")
def read_paper(paper_id: int, db: Session = Depends(get_db)):
    db_paper = repository.get_paper(db, paper_id=paper_id)
    if db_paper is None:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED,
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.post("/create")
def create_paper(
    paper: schemas.PaperCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(authenticate_user),
):
    db_paper = repository.create_paper(db=db, paper=paper, user_id=user_id)
    return api_response(
        StatusCode.CREATED,
        ResponseMessage.CREATED,
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.put("/update/{paper_id}")
def update_paper(
    paper_id: int, paper: schemas.PaperUpdate, db: Session = Depends(get_db)
):
    db_paper = repository.update_paper(db=db, paper_id=paper_id, paper_update=paper)
    if db_paper is None:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED,
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.delete("/delete/{paper_id}")
def delete_paper(paper_id: int, db: Session = Depends(get_db)):
    success = repository.delete_paper(db=db, paper_id=paper_id)
    if not success:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)
    return api_response(StatusCode.OK, ResponseMessage.DELETED)
