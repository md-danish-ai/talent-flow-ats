# app/questions/repository.py

import json
from sqlalchemy import text
from app.database.db import SessionLocal


def create_question(data, q_type: str, s_type: str, e_level: str, user_id: int):
    db = SessionLocal()
    try:
        options_json = None
        if data.options:
            options_json = json.dumps([opt.dict() for opt in data.options])

        result = db.execute(
            text("""
                INSERT INTO questions (
                    question_type, subject_type, exam_level,
                    question_text, image_url, passage,
                    marks, is_active, options, created_by
                )
                VALUES (
                    :question_type, :subject_type, :exam_level,
                    :question_text, :image_url, :passage,
                    :marks, :is_active, :options, :created_by
                )
                RETURNING id
            """),
            {
                "question_type": q_type,
                "subject_type": s_type,
                "exam_level": e_level,
                "question_text": data.question_text,
                "image_url": data.image_url,
                "passage": data.passage,
                "marks": data.marks,
                "is_active": data.is_active,
                "options": options_json,
                "created_by": user_id,
            }
        )
        question_id = result.mappings().first()["id"]

        if data.answer:
            db.execute(
                text("""
                    INSERT INTO question_answers (question_id, answer_text, explanation, created_by)
                    VALUES (:question_id, :answer_text, :explanation, :created_by)
                """),
                {
                    "question_id": question_id,
                    "answer_text": data.answer.answer_text,
                    "explanation": data.answer.explanation,
                    "created_by": user_id,
                }
            )

        db.commit()
        return {"message": "Question created successfully", "id": question_id}

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


_BASE_QUESTION_SELECT = """
    SELECT
        q.id,
        q.question_text,
        q.image_url,
        q.passage,
        q.marks,
        q.is_active,
        q.options,
        q.created_at,
        q.updated_at,

        qt.id         AS qt_id,
        qt.code       AS qt_code,
        qt.type       AS qt_type,
        qt.name       AS qt_name,
        qt.metadata   AS qt_metadata,
        qt.is_active  AS qt_is_active,
        qt.sort_order AS qt_sort_order,

        st.id         AS st_id,
        st.code       AS st_code,
        st.type       AS st_type,
        st.name       AS st_name,
        st.metadata   AS st_metadata,
        st.is_active  AS st_is_active,
        st.sort_order AS st_sort_order,

        el.id         AS el_id,
        el.code       AS el_code,
        el.type       AS el_type,
        el.name       AS el_name,
        el.metadata   AS el_metadata,
        el.is_active  AS el_is_active,
        el.sort_order AS el_sort_order

    FROM questions q
    LEFT JOIN classifications qt ON qt.code = q.question_type AND qt.type = 'question_type'
    LEFT JOIN classifications st ON st.code = q.subject_type  AND st.type = 'subject_type'
    LEFT JOIN classifications el ON el.code = q.exam_level    AND el.type = 'exam_level'
"""


def get_questions(
    question_type: str = None,
    subject_type:  str = None,
    exam_level:    str = None,
    is_active:     bool = None
):
    db = SessionLocal()
    try:
        query = _BASE_QUESTION_SELECT + " WHERE 1=1"
        params = {}

        if question_type is not None:
            query += " AND q.question_type = :question_type"
            params["question_type"] = question_type
        if subject_type is not None:
            query += " AND q.subject_type = :subject_type"
            params["subject_type"] = subject_type
        if exam_level is not None:
            query += " AND q.exam_level = :exam_level"
            params["exam_level"] = exam_level
        if is_active is not None:
            query += " AND q.is_active = :is_active"
            params["is_active"] = is_active

        query += " ORDER BY q.created_at DESC"

        result = db.execute(text(query), params)
        return [_format_question(row) for row in result.mappings().all()]
    finally:
        db.close()


def get_question_by_id(question_id: int):
    db = SessionLocal()
    try:
        result = db.execute(
            text(_BASE_QUESTION_SELECT + " WHERE q.id = :id"),
            {"id": question_id}
        )
        row = result.mappings().first()
        return _format_question(row) if row else None
    finally:
        db.close()


def update_question(question_id: int, payload, q_type: str = None, s_type: str = None, e_level: str = None):
    db = SessionLocal()
    try:
        data = payload.dict(exclude_unset=True)

        answer_data = data.pop("answer", None)
        options_data = data.pop("options", None)

        if q_type:
            data["question_type"] = q_type
        if s_type:
            data["subject_type"] = s_type
        if e_level:
            data["exam_level"] = e_level

        if options_data is not None:
            data["options"] = json.dumps(options_data)

        if data:
            update_parts = [f"{k} = :{k}" for k in data.keys()]
            update_parts.append("updated_at = CURRENT_TIMESTAMP")
            params = {**data, "id": question_id}

            db.execute(
                text(f"""
                    UPDATE questions
                    SET {', '.join(update_parts)}
                    WHERE id = :id
                """),
                params
            )

        if answer_data:
            db.execute(
                text("""
                    UPDATE question_answers
                    SET answer_text = :answer_text, explanation = :explanation
                    WHERE question_id = :question_id
                """),
                {
                    "answer_text": answer_data.get("answer_text"),
                    "explanation": answer_data.get("explanation"),
                    "question_id": question_id,
                }
            )

        db.commit()
        return {"message": f"Question {question_id} updated successfully"}

    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def delete_question(question_id: int):
    db = SessionLocal()
    try:
        db.execute(
            text("""
                UPDATE questions
                SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            """),
            {"id": question_id}
        )
        db.commit()
        return {"message": f"Question {question_id} deactivated successfully"}
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


# ─── Helper ───────────────────────────────────────────────────────────────────

def _format_question(row) -> dict:
    row = dict(row)
    return {
        "id":            row["id"],
        "question_text": row["question_text"],
        "image_url":     row["image_url"],
        "passage":       row["passage"],
        "marks":         row["marks"],
        "is_active":     row["is_active"],
        "options":       row["options"],
        "created_at":    str(row["created_at"]),
        "updated_at":    str(row["updated_at"]),

        "question_type": {
            "id":         row["qt_id"],
            "code":       row["qt_code"],
            "type":       row["qt_type"],
            "name":       row["qt_name"],
            "metadata":   row["qt_metadata"],
            "is_active":  row["qt_is_active"],
            "sort_order": row["qt_sort_order"],
        } if row.get("qt_id") else None,

        "subject_type": {
            "id":         row["st_id"],
            "code":       row["st_code"],
            "type":       row["st_type"],
            "name":       row["st_name"],
            "metadata":   row["st_metadata"],
            "is_active":  row["st_is_active"],
            "sort_order": row["st_sort_order"],
        } if row.get("st_id") else None,

        "exam_level": {
            "id":         row["el_id"],
            "code":       row["el_code"],
            "type":       row["el_type"],
            "name":       row["el_name"],
            "metadata":   row["el_metadata"],
            "is_active":  row["el_is_active"],
            "sort_order": row["el_sort_order"],
        } if row.get("el_id") else None,
    }
