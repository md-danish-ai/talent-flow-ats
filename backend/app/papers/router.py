import io
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.database.db import SessionLocal
from app.papers import repository, schemas
from app.papers.pdf_service import generate_paper_pdf_file
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


@router.get("/get-papers")
def read_papers(
    pagination: PaginationParams = Depends(get_pagination_params),
    department_id: Optional[int] = Query(None),
    test_level_id: Optional[int] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    offset = (pagination.page - 1) * pagination.limit
    papers, total_records = repository.get_papers(
        db,
        skip=offset,
        limit=pagination.limit,
        department_id=department_id,
        test_level_id=test_level_id,
        search=pagination.search,
        is_active=is_active,
    )

    # Convert SQLAlchemy objects to Pydantic models and then to dicts for proper serialization
    paper_list = [
        schemas.PaperResponse.model_validate(paper).model_dump() for paper in papers
    ]

    paginated_data = create_paginated_response(paper_list, total_records, pagination)
    return api_response(
        StatusCode.OK, ResponseMessage.FETCHED("Paper"), data=paginated_data
    )


@router.get("/paper-details/{paper_id}")
def read_paper(paper_id: int, db: Session = Depends(get_db)):
    db_paper = repository.get_paper(db, paper_id=paper_id)
    if db_paper is None:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND("Paper"))
    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED("Paper"),
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.post("/create-paper")
def create_paper(
    paper: schemas.PaperCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(authenticate_user),
):
    db_paper = repository.create_paper(db=db, paper=paper, user_id=user_id)
    return api_response(
        StatusCode.CREATED,
        ResponseMessage.CREATED("Paper"),
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.put("/update-paper/{paper_id}")
def update_paper(
    paper_id: int, paper: schemas.PaperUpdate, db: Session = Depends(get_db)
):
    db_paper = repository.update_paper(db=db, paper_id=paper_id, paper_update=paper)
    if db_paper is None:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND("Paper"))
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED("Paper"),
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.put("/grade-settings/{paper_id}")
def update_grade_settings(
    paper_id: int,
    grade_settings: List[schemas.GradeSettingItem],
    db: Session = Depends(get_db),
):
    grade_data = [item.model_dump() for item in grade_settings]
    db_paper = repository.update_paper_grade_settings(
        db=db, paper_id=paper_id, grade_settings=grade_data
    )
    if db_paper is None:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND("Paper"))
    return api_response(
        StatusCode.OK,
        ResponseMessage.UPDATED("Paper"),
        data=schemas.PaperResponse.model_validate(db_paper).model_dump(),
    )


@router.get("/paper-details/{paper_id}/pdf")
def download_paper_pdf(
    paper_id: int,
    show_answers: bool = Query(True),
    db: Session = Depends(get_db),
):
    """Generate and stream a clean PDF for the question paper or official answer key."""
    try:
        pdf_bytes, filename = generate_paper_pdf_file(
            db, paper_id=paper_id, show_answers=show_answers
        )
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=str(ve),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR,
            detail=f"Paper PDF generation failed: {str(exc)}",
        )
