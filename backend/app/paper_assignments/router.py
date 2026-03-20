from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.db import SessionLocal
from app.utils.dependencies import authenticate_user, require_roles
from app.utils.status_codes import ResponseMessage, StatusCode, api_response

from . import repository, schemas

router = APIRouter(
    prefix="/paper-assignments",
    tags=["Paper Assignments"],
    dependencies=[Depends(authenticate_user)],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/assign",
    dependencies=[Depends(require_roles(["admin"]))],
)
def assign_paper(
    payload: schemas.PaperAssignmentCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
):
    assignment = repository.assign_paper_to_user(
        db=db, payload=payload, assigned_by=current_user
    )
    return api_response(
        StatusCode.CREATED,
        ResponseMessage.CREATED,
        data=schemas.PaperAssignmentResponse.model_validate(assignment).model_dump(),
    )


@router.get(
    "/by-date",
    dependencies=[Depends(require_roles(["admin"]))],
)
def get_assignments_by_date(
    assigned_date: date = Query(..., description="Assignment date in YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    assignments = repository.get_assignments_by_date(
        db=db, assigned_date=assigned_date
    )
    data = [
        schemas.PaperAssignmentResponse.model_validate(item).model_dump()
        for item in assignments
    ]
    return api_response(StatusCode.OK, ResponseMessage.FETCHED, data=data)


@router.get("/my-paper")
def get_my_assigned_paper(
    assigned_date: date = Query(..., description="Assignment date in YYYY-MM-DD"),
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
):
    assignment = repository.get_assignment_by_user_and_date(
        db=db, user_id=current_user, assigned_date=assigned_date
    )
    if not assignment:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)

    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED,
        data=schemas.PaperAssignmentResponse.model_validate(assignment).model_dump(),
    )
