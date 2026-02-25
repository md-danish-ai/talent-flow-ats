# app/classifications/repository.py

import json
from sqlalchemy import text
from app.database.db import SessionLocal


def get_all(type_filter: str = None, is_active: bool = None):
    db = SessionLocal()
    try:
        query = "SELECT * FROM classifications WHERE 1=1"
        params = {}
        if type_filter:
            query += " AND type = :type"
            params["type"] = type_filter
        if is_active is not None:
            query += " AND is_active = :is_active"
            params["is_active"] = is_active
        query += " ORDER BY type, sort_order, name"
        result = db.execute(text(query), params)
        return [dict(row) for row in result.mappings().all()]
    finally:
        db.close()


def get_by_id(classification_id: int):
    db = SessionLocal()
    try:
        result = db.execute(
            text("SELECT * FROM classifications WHERE id = :id"),
            {"id": classification_id}
        )
        row = result.mappings().first()
        return dict(row) if row else None
    finally:
        db.close()


def get_by_code_and_type(code: str, type_: str):
    db = SessionLocal()
    try:
        result = db.execute(
            text("SELECT * FROM classifications WHERE code = :code AND type = :type"),
            {"code": code.upper(), "type": type_}
        )
        row = result.mappings().first()
        return dict(row) if row else None
    finally:
        db.close()


def update(classification_id: int, data):
    db = SessionLocal()
    try:
        fields = data.dict(exclude_unset=True)
        if not fields:
            return get_by_id(classification_id)

        update_parts = []
        params = {"id": classification_id}

        for key, value in fields.items():
            if key == "metadata" and value is not None:
                value = json.dumps(value)
            if key == "name":
                # Also update code when name changes
                update_parts.append("code = :auto_code")
                params["auto_code"] = value.upper()
            update_parts.append(f"{key} = :{key}")
            params[key] = value

        update_parts.append("updated_at = CURRENT_TIMESTAMP")

        result = db.execute(
            text(f"""
                UPDATE classifications
                SET {', '.join(update_parts)}
                WHERE id = :id
                RETURNING *
            """),
            params
        )
        row = result.mappings().first()
        db.commit()
        return dict(row) if row else None
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def delete(classification_id: int):
    db = SessionLocal()
    try:
        db.execute(
            text("""
                UPDATE classifications
                SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            """),
            {"id": classification_id}
        )
        db.commit()
        return {"message": f"Classification {classification_id} deactivated successfully"}
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def count_by_name_and_type(name: str, type_: str):
    db = SessionLocal()
    try:
        result = db.execute(
            text(
                "SELECT COUNT(*) as count FROM classifications WHERE name = :name AND type = :type"),
            {"name": name, "type": type_}
        )
        row = result.mappings().first()
        return int(row["count"]) if row else 0
    finally:
        db.close()


def count_by_type(type_: str):
    db = SessionLocal()
    try:
        result = db.execute(
            text("SELECT COUNT(*) as count FROM classifications WHERE type = :type"),
            {"type": type_}
        )
        row = result.mappings().first()
        return int(row["count"]) if row else 0
    finally:
        db.close()


def create(data, code: str):
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
                INSERT INTO classifications (code, type, name, metadata, sort_order, is_active)
                VALUES (:code, :type, :name, :metadata, :sort_order, :is_active)
                RETURNING *
            """),
            {
                "code": code.upper(),
                "type": data.type,
                "name": data.name,
                "metadata": json.dumps(getattr(data, "metadata", None)) if getattr(data, "metadata", None) else None,
                "sort_order": getattr(data, "sort_order", 0),
                "is_active": getattr(data, "is_active", True),
            }
        )
        row = result.mappings().first()
        if not row:
            raise Exception("Insert failed, no row returned")
        db.commit()
        return dict(row)
    except Exception as e:
        print("CREATE CLASSIFICATION ERROR:", str(e))
        db.rollback()
        raise
    finally:
        db.close()
