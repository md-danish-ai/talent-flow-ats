from app.database.db import get_db
from fastapi import HTTPException


def create_answer(data, user_id: int):
    conn = get_db()
    cur = conn.cursor()

    try:
        # 1. Check question exists
        cur.execute("SELECT id FROM questions WHERE id = %s",
                    (data.question_id,))
        if not cur.fetchone():
            raise HTTPException(
                status_code=404,
                detail=f"Question {data.question_id} does not exist"
            )

        # 2. Check answer already exists
        cur.execute(
            "SELECT id FROM question_answers WHERE question_id = %s", (data.question_id,))
        if cur.fetchone():
            raise HTTPException(
                status_code=409,
                detail=f"Answer for question {data.question_id} already exists"
            )

        # 3. Insert answer
        cur.execute("""
            INSERT INTO question_answers (question_id, answer_text, explanation, created_by)
            VALUES (%s, %s, %s, %s)
            RETURNING id, question_id, answer_text, explanation, created_by, created_at
        """, (
            data.question_id,
            data.answer_text,
            data.explanation,
            user_id
        ))

        answer = dict(cur.fetchone())
        conn.commit()
        return answer

    except HTTPException:
        raise

    except Exception as e:
        conn.rollback()
        raise e

    finally:
        cur.close()
        conn.close()


def get_answer_by_question(question_id: int):
    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT
                qa.id,
                qa.question_id,
                qa.answer_text,
                qa.explanation,
                qa.created_by,
                qa.created_at,
                q.question_text,
                q.question_type
            FROM question_answers qa
            JOIN questions q ON q.id = qa.question_id
            WHERE qa.question_id = %s
        """, (question_id,))

        row = cur.fetchone()

        if not row:
            raise HTTPException(
                status_code=404,
                detail=f"No answer found for question {question_id}"
            )

        return dict(row)

    except HTTPException:
        raise

    finally:
        cur.close()
        conn.close()
