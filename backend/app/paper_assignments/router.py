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
    
    # Check if this was an update or creation by comparing timestamps
    is_update = assignment.created_at != assignment.updated_at
    message = "Paper assignment updated successfully" if is_update else "Paper set assigned successfully"
    
    return api_response(
        StatusCode.CREATED,
        message,
        data=schemas.PaperAssignmentResponse.model_validate(assignment).model_dump(),
    )
