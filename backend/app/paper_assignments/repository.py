from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session, aliased

from app.papers.models import Paper
from app.users.models import User
from app.utils.status_codes import StatusCode

from .models import PaperAssignment
from .schemas import PaperAssignmentCreate


def _build_assignment_query(db: Session):
    assigned_by_user = aliased(User)
    return (
        db.query(
            PaperAssignment,
            User.username.label("username"),
            Paper.paper_name.label("paper_name"),
            assigned_by_user.username.label("assigned_by_name"),
        )
        .join(User, PaperAssignment.user_id == User.id)
        .join(Paper, PaperAssignment.paper_id == Paper.id)
        .outerjoin(assigned_by_user, PaperAssignment.assigned_by == assigned_by_user.id)
    )


def _hydrate_assignment_result(result):
    if not result:
        return None

    assignment, username, paper_name, assigned_by_name = result
    assignment.username = username
    assignment.paper_name = paper_name
    assignment.assigned_by_name = assigned_by_name
    return assignment


def assign_paper_to_user(
    db: Session, payload: PaperAssignmentCreate, assigned_by: int
) -> PaperAssignment:
    user = (
        db.query(User)
        .filter(
            User.id == payload.user_id,
            User.role == "user",
            User.is_active.is_(True),
        )
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=f"Active user {payload.user_id} not found",
        )

    paper = (
        db.query(Paper)
        .filter(Paper.id == payload.paper_id, Paper.is_active.is_(True))
        .first()
    )
    if not paper:
        raise HTTPException(
            status_code=StatusCode.NOT_FOUND,
            detail=f"Active paper {payload.paper_id} not found",
        )

    existing_assignment = (
        db.query(PaperAssignment)
        .filter(
            PaperAssignment.user_id == payload.user_id,
            PaperAssignment.assigned_date == payload.assigned_date,
        )
        .first()
    )

    if existing_assignment:
        existing_assignment.paper_id = payload.paper_id
        existing_assignment.department_id = payload.department_id
        existing_assignment.test_level_id = payload.test_level_id
        existing_assignment.assigned_by = assigned_by
        db.commit()
        db.refresh(existing_assignment)
        return get_assignment_by_user_and_date(
            db, user_id=payload.user_id, assigned_date=payload.assigned_date
        )

    assignment = PaperAssignment(
        user_id=payload.user_id,
        paper_id=payload.paper_id,
        department_id=payload.department_id,
        test_level_id=payload.test_level_id,
        assigned_date=payload.assigned_date,
        assigned_by=assigned_by,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return get_assignment_by_user_and_date(
        db, user_id=payload.user_id, assigned_date=payload.assigned_date
    )



def get_assignment_by_user_and_date(
    db: Session, user_id: int, assigned_date: date
) -> PaperAssignment | None:
    result = (
        _build_assignment_query(db)
        .filter(
            PaperAssignment.user_id == user_id,
            PaperAssignment.assigned_date == assigned_date,
        )
        .first()
    )
    return _hydrate_assignment_result(result)
