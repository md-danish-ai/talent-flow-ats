from sqlalchemy import or_
from app.departments.models import Department
from app.users.models import User


def requires_interview_department(db, department_id: int) -> bool:
    """Returns True if the department requires an interview, False otherwise."""
    if not department_id:
        return False
    dept = db.query(Department).filter(Department.id == department_id).first()
    if dept is None:
        return False
    return dept.requires_interview


def exclude_no_interview_users(db, query, user_model=User):
    """
    Exclude users whose department has requires_interview = False.
    This replaces the old hardcoded 'Software' name check.
    """
    non_interview_dept_ids = [
        dept.id
        for dept in db.query(Department)
        .filter(
            Department.requires_interview == False  # noqa: E712
        )
        .all()
    ]
    if non_interview_dept_ids:
        return query.filter(
            or_(
                ~user_model.department_id.in_(non_interview_dept_ids),
                user_model.department_id.is_(None),
            )
        )
    return query


# ── Backward-compat aliases (old callers) ───────────────────────────────────
def is_software_department(db, department_id: int) -> bool:
    """Deprecated: use requires_interview_department() instead."""
    return not requires_interview_department(db, department_id)


def exclude_software_users(db, query, user_model=User):
    """Deprecated: use exclude_no_interview_users() instead."""
    return exclude_no_interview_users(db, query, user_model)
