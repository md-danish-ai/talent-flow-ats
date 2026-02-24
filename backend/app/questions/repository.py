import json
from app.database.db import get_db


def create_question(data, user_id):
    conn = get_db()
    cur = conn.cursor()

    try:
        # Convert Pydantic options list to JSON string for storage
        options_json = None
        if data.options:
            options_json = json.dumps([opt.dict() for opt in data.options])

        # Insert question
        cur.execute("""
            INSERT INTO questions (
                question_type, question_text, subject,
                image_url, passage, marks,
                difficulty_level, is_active, options, created_by
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id
        """, (
            data.question_type,
            data.question_text,
            data.subject,
            data.image_url,
            data.passage,
            data.marks,
            data.difficulty_level,
            data.is_active,
            options_json,
            user_id
        ))

        question_id = cur.fetchone()["id"]

        # Insert answer if subjective
        if data.answer:
            cur.execute("""
                INSERT INTO question_answers
                (question_id, answer_text, explanation, created_by)
                VALUES (%s,%s,%s,%s)
            """, (
                question_id,
                data.answer.answer_text,
                data.answer.explanation,
                user_id
            ))

        conn.commit()
        return {"message": "Question created successfully"}

    except Exception as e:
        conn.rollback()
        raise e

    finally:
        cur.close()
        conn.close()

def get_questions(
    question_type: str = None,
    subject: str = None,
    difficulty_level: str = None,
    is_active: bool = None
):
    conn = get_db()
    cur = conn.cursor()

    try:
        query = "SELECT * FROM questions WHERE 1=1"
        values = []

        if question_type:
            query += " AND question_type = %s"
            values.append(question_type)

        if subject:
            query += " AND subject = %s"
            values.append(subject)

        if difficulty_level:
            query += " AND difficulty_level = %s"
            values.append(difficulty_level)

        if is_active is not None:
            query += " AND is_active = %s"
            values.append(is_active)

        cur.execute(query, tuple(values))
        results = cur.fetchall()

        return results

    finally:
        cur.close()
        conn.close()


def update_question_in_db(question_id: int, payload):
    conn = get_db()
    cur = conn.cursor()

    try:
        update_fields = []
        values = []

        data = payload.dict(exclude_unset=True)

        for key, value in data.items():
            if key == "options" and value is not None:
                import json
                value = json.dumps(value)

            update_fields.append(f"{key} = %s")
            values.append(value)

        if not update_fields:
            return {"message": "No fields provided for update"}

        update_query = f"""
            UPDATE questions
            SET {', '.join(update_fields)},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """

        values.append(question_id)

        cur.execute(update_query, tuple(values))
        conn.commit()

        return {"message": f"Question {question_id} updated successfully"}

    except Exception as e:
        conn.rollback()
        raise e

    finally:
        cur.close()
        conn.close()


def delete_question(question_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE questions
            SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (question_id,))
        conn.commit()
        return {"message": f"Question {question_id} deactivated successfully"}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        cur.close()
        conn.close()

     