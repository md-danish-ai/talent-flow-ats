# app/classifications/repository.py

from app.database.db import SessionLocal
from app.classifications.models import Classification
from app.questions.models import Question
from app.papers.models import Paper


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

        old_code = classification.code
        classification_type = classification.type

        fields = data.dict(exclude_unset=True)
        for key, value in fields.items():
            if key == "name":
                classification.code = value.upper().replace(" ", "_")
            setattr(classification, key, value)

        new_code = classification.code

        # --- Cascade code update to all dependent tables ---
        if old_code != new_code:
            _cascade_code_update(
                db_session=db_session,
                classification_type=classification_type,
                old_code=old_code,
                new_code=new_code
            )
        # ----------------------------------------------------

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


def _cascade_code_update(db_session, classification_type: str, old_code: str, new_code: str):
    """
    Propagate a classification code rename to all tables that store code values
    as denormalized string references.

    Dependency map:
      - 'question_type'  → questions.question_type
      - 'subject'        → questions.subject_type
      - 'exam_level'     → questions.exam_level, papers.level

    papers.subject_id is JSONB and will store subject codes directly once the
    papers feature is complete; cascade it when the type is 'subject'.
    """
    if classification_type == "question_type":
        db_session.query(Question).filter(
            Question.question_type == old_code
        ).update({"question_type": new_code}, synchronize_session=False)

    elif classification_type == "subject":
        db_session.query(Question).filter(
            Question.subject_type == old_code
        ).update({"subject_type": new_code}, synchronize_session=False)

        # papers.subject_id stores subject codes as a JSONB array e.g. ["GRAMMAR", "MATH"].
        # Replace the specific old element with the new one, preserving other elements.
        db_session.execute(
            __import__("sqlalchemy").text(
                """
                UPDATE papers
                SET subject_id = (
                    SELECT jsonb_agg(
                        CASE WHEN elem::text = :old_code_quoted
                             THEN :new_code::jsonb
                             ELSE elem
                        END
                    )
                    FROM jsonb_array_elements(subject_id) AS elem
                )
                WHERE subject_id @> CAST(:old_code_array AS jsonb)
                """
            ),
            {
                "old_code_quoted": f'"{old_code}"',
                "new_code": f'"{new_code}"',
                "old_code_array": f'["{old_code}"]'
            }
        )

    elif classification_type == "exam_level":
        db_session.query(Question).filter(
            Question.exam_level == old_code
        ).update({"exam_level": new_code}, synchronize_session=False)

        db_session.query(Paper).filter(
            Paper.level == old_code
        ).update({"level": new_code}, synchronize_session=False)


def check_dependencies(classification_id: int) -> dict:
    """
    Check all tables that store classification codes as plain string references.
    Returns a dict mapping 'table.column' -> count of dependent rows.
    Only entries with count > 0 are included.
    """
    db_session = SessionLocal()
    try:
        classification = db_session.query(Classification).filter(
            Classification.id == classification_id).first()
        if not classification:
            return {}

        code = classification.code
        classification_type = classification.type
        deps = {}

        if classification_type == "question_type":
            count = db_session.query(Question).filter(
                Question.question_type == code).count()
            if count:
                deps["questions.question_type"] = count

        elif classification_type == "subject":
            count = db_session.query(Question).filter(
                Question.subject_type == code).count()
            if count:
                deps["questions.subject_type"] = count

            # papers.subject_id stores subject codes as a JSONB array.
            # Use the @> containment operator to find rows that include the code.
            paper_count = db_session.execute(
                __import__("sqlalchemy").text(
                    "SELECT COUNT(*) FROM papers "
                    "WHERE subject_id @> CAST(:code_array AS jsonb)"
                ),
                {"code_array": f'["{code}"]'}
            ).scalar() or 0
            if paper_count:
                deps["papers.subject_id"] = paper_count

        elif classification_type == "exam_level":
            q_count = db_session.query(Question).filter(
                Question.exam_level == code).count()
            if q_count:
                deps["questions.exam_level"] = q_count

            p_count = db_session.query(Paper).filter(
                Paper.level == code).count()
            if p_count:
                deps["papers.level"] = p_count

        return deps
    finally:
        db_session.close()


def delete(classification_id: int):
    db_session = SessionLocal()
    try:
        classification = db_session.query(Classification).filter(
            Classification.id == classification_id).first()
        if classification:
            db_session.delete(classification)
            db_session.commit()
        return {"message": f"Classification {classification_id} deleted permanently"}
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
            code=code.upper().replace(" ", "_"),
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
