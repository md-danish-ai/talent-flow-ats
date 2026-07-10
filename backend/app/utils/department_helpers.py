from sqlalchemy import or_
from app.departments.models import Department
from app.users.models import User


def is_software_department(db, department_id: int) -> bool:
    if not department_id:
        return False
    dept = db.query(Department).filter(Department.id == department_id).first()
    return dept is not None and dept.name == "Software"


def exclude_software_users(db, query, user_model=User):
    dept = db.query(Department).filter(Department.name == "Software").first()
    if dept:
        return query.filter(
            or_(user_model.department_id != dept.id, user_model.department_id.is_(None))
        )
    return query
