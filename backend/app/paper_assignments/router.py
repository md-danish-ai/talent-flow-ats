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
    "/assign-new-paper",
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


@router.get("/get-my-assigned-paper")
def get_my_interview_paper(
    assigned_date: date | None = Query(
        default=None, description="Optional assignment date in YYYY-MM-DD"
    ),
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
):
    data = repository.get_my_interview_paper(
        db=db,
        user_id=current_user,
        assigned_date=assigned_date,
    )
    if not data:
        return api_response(StatusCode.NOT_FOUND, ResponseMessage.NOT_FOUND)

    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED,
        data=schemas.AssignedInterviewPaperResponse.model_validate(data).model_dump(),
    )


# --- AUTO ASSIGNMENT RULES ---

@router.post(
    "/get-auto-rules",
    dependencies=[Depends(require_roles(["admin"]))],
)
def create_auto_rule(
    payload: schemas.AutoAssignmentRuleCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(authenticate_user),
):
    rule = repository.create_auto_assignment_rule(
        db=db, payload=payload, created_by=current_user
    )
    return api_response(
        StatusCode.CREATED,
        "Auto-assignment rule configured successfully",
        data=schemas.AutoAssignmentRuleResponse.model_validate(rule).model_dump(),
    )


@router.get(
    "/get-auto-rules",
    dependencies=[Depends(require_roles(["admin"]))],
)
def list_auto_rules(
    assigned_date: date | None = Query(None),
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    db: Session = Depends(get_db),
):
    rules = repository.get_auto_assignment_rules(
        db=db, 
        assigned_date=assigned_date,
        date_from=date_from,
        date_to=date_to
    )
    return api_response(
        StatusCode.OK,
        ResponseMessage.FETCHED,
        data=[
            schemas.AutoAssignmentRuleResponse.model_validate(r).model_dump()
            for r in rules
        ],
    )


@router.patch(
    "/get-auto-rule-details/{rule_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
def update_auto_rule(
    rule_id: int,
    payload: schemas.AutoAssignmentRuleUpdate,
    db: Session = Depends(get_db),
):
    rule = repository.update_auto_assignment_rule(
        db=db, rule_id=rule_id, payload=payload
    )
    return api_response(
        StatusCode.OK,
        "Auto-assignment rule updated successfully",
        data=schemas.AutoAssignmentRuleResponse.model_validate(rule).model_dump(),
    )


@router.delete(
    "/remove-auto-rule/{rule_id}",
    dependencies=[Depends(require_roles(["admin"]))],
)
def delete_auto_rule(
    rule_id: int,
    db: Session = Depends(get_db),
):
    result = repository.delete_auto_assignment_rule(db=db, rule_id=rule_id)
    return api_response(StatusCode.OK, result["message"])
