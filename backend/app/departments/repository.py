from app.database.db import SessionLocal
from app.departments.models import Department

def _to_dict(department):
    if not department:
        return None
    return {
        "id": department.id,
        "name": department.name,
        "is_active": department.is_active,
        "created_at": department.created_at,
        "updated_at": department.updated_at,
    }

def get_all(
    is_active: bool = None,
    search: str = None,
    limit: int = 10,
    offset: int = 0,
):
    db_session = SessionLocal()
    try:
        query = db_session.query(Department)
        if is_active is not None:
            query = query.filter(Department.is_active == is_active)
        if search:
            query = query.filter(Department.name.ilike(f"%{search}%"))

        total_records = query.count()
        results = query.order_by(Department.id.desc()).offset(offset).limit(limit).all()
        
        data = [_to_dict(dept) for dept in results]
        return data, total_records
    finally:
        db_session.close()

def get_by_id(department_id: int):
    db_session = SessionLocal()
    try:
        department = db_session.query(Department).filter(Department.id == department_id).first()
        return _to_dict(department)
    finally:
        db_session.close()

def create(data):
    db_session = SessionLocal()
    try:
        new_department = Department(
            name=data.name,
            is_active=getattr(data, "is_active", True)
        )
        db_session.add(new_department)
        db_session.commit()
        db_session.refresh(new_department)
        return _to_dict(new_department)
    except Exception as e:
        db_session.rollback()
        raise e
    finally:
        db_session.close()

def update(department_id: int, data):
    db_session = SessionLocal()
    try:
        department = db_session.query(Department).filter(Department.id == department_id).first()
        if not department:
            return None
        
        fields = data.dict(exclude_unset=True)
        for key, value in fields.items():
            setattr(department, key, value)
            
        db_session.commit()
        db_session.refresh(department)
        return _to_dict(department)
    except Exception as e:
        db_session.rollback()
        raise e
    finally:
        db_session.close()

def delete(department_id: int):
    db_session = SessionLocal()
    try:
        department = db_session.query(Department).filter(Department.id == department_id).first()
        if department:
            db_session.delete(department)
            db_session.commit()
            return True
        return False
    except Exception as e:
        db_session.rollback()
        raise e
    finally:
        db_session.close()
