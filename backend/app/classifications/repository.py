# app/classifications/repository.py

from app.database.db import SessionLocal
from app.classifications.models import Classification


def get_all(
    type_filter: str = None,
    is_active: bool = None,
    search: str = None,
    sort_by: str = "sort_order",
    order: str = "asc",
    limit: int = 10,
    offset: int = 0
):
    db_session = SessionLocal()
    try:
        query = db_session.query(Classification)
        if type_filter:
            query = query.filter(Classification.type == type_filter)
        if is_active is not None:
            query = query.filter(Classification.is_active == is_active)
        if search:
            query = query.filter(
                (Classification.name.ilike(f"%{search}%")) |
                (Classification.code.ilike(f"%{search}%"))
            )

        total_records = query.count()

        sort_column = getattr(Classification, sort_by,
                              Classification.sort_order)
        if order == "desc":
            query = query.order_by(Classification.type, sort_column.desc())
        else:
            query = query.order_by(Classification.type, sort_column.asc())

        results = query.offset(offset).limit(limit).all()
        # Convert to dict for backward compatibility if needed,
        # though ideally the calling code should start using objects
        data = [
            {
                "id": classification.id,
                "code": classification.code,
                "type": classification.type,
                "name": classification.name,
                "metadata": classification.extra_metadata,
                "sort_order": classification.sort_order,
                "is_active": classification.is_active,
                "created_at": classification.created_at,
                "updated_at": classification.updated_at
            }
            for classification in results
        ]
        return data, total_records
    finally:
        db_session.close()


def get_by_id(classification_id: int):
    db_session = SessionLocal()
    try:
        classification = db_session.query(Classification).filter(
            Classification.id == classification_id).first()
        if not classification:
            return None
        return {
            "id": classification.id,
            "code": classification.code,
            "type": classification.type,
            "name": classification.name,
            "metadata": classification.extra_metadata,
            "sort_order": classification.sort_order,
            "is_active": classification.is_active,
            "created_at": classification.created_at,
            "updated_at": classification.updated_at
        }
    finally:
        db_session.close()


def get_by_code_and_type(code: str, type_: str):
    db_session = SessionLocal()
    try:
        classification = db_session.query(Classification).filter(
            Classification.code == code.upper(),
            Classification.type == type_
        ).first()
        if not classification:
            return None
        return {
            "id": classification.id,
            "code": classification.code,
            "type": classification.type,
            "name": classification.name,
            "metadata": classification.extra_metadata,
            "sort_order": classification.sort_order,
            "is_active": classification.is_active,
            "created_at": classification.created_at,
            "updated_at": classification.updated_at
        }
    finally:
        db_session.close()


def update(classification_id: int, data):
    db_session = SessionLocal()
    try:
        classification = db_session.query(Classification).filter(
            Classification.id == classification_id).first()
        if not classification:
            return None

        fields = data.dict(exclude_unset=True)
        for key, value in fields.items():
            if key == "name":
                classification.code = value.upper()
            setattr(classification, key, value)

        db_session.commit()
        db_session.refresh(classification)
        return {
            "id": classification.id,
            "code": classification.code,
            "type": classification.type,
            "name": classification.name,
            "metadata": classification.extra_metadata,
            "sort_order": classification.sort_order,
            "is_active": classification.is_active,
            "created_at": classification.created_at,
            "updated_at": classification.updated_at
        }
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def delete(classification_id: int):
    db_session = SessionLocal()
    try:
        classification = db_session.query(Classification).filter(
            Classification.id == classification_id).first()
        if classification:
            classification.is_active = False
            db_session.commit()
        return {"message": f"Classification {classification_id} deactivated successfully"}
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def count_by_name_and_type(name: str, type_: str):
    db_session = SessionLocal()
    try:
        return db_session.query(Classification).filter(
            Classification.name == name,
            Classification.type == type_
        ).count()
    finally:
        db_session.close()


def count_by_type(type_: str):
    db_session = SessionLocal()
    try:
        return db_session.query(Classification).filter(Classification.type == type_).count()
    finally:
        db_session.close()


def create(data, code: str):
    db_session = SessionLocal()
    try:
        new_classification = Classification(
            code=code.upper(),
            type=data.type,
            name=data.name,
            extra_metadata=getattr(data, "metadata", None),
            sort_order=getattr(data, "sort_order", 0),
            is_active=getattr(data, "is_active", True)
        )
        db_session.add(new_classification)
        db_session.commit()
        db_session.refresh(new_classification)
        return {
            "id": new_classification.id,
            "code": new_classification.code,
            "type": new_classification.type,
            "name": new_classification.name,
            "metadata": new_classification.extra_metadata,
            "sort_order": new_classification.sort_order,
            "is_active": new_classification.is_active,
            "created_at": new_classification.created_at,
            "updated_at": new_classification.updated_at
        }
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()
