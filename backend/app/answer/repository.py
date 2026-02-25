# app/answer/repository.py

from sqlalchemy import text
from app.database.db import SessionLocal
from fastapi import HTTPException
from app.utils.status_codes import StatusCode


def create_answer(data, user_id: int):
    db = SessionLocal()
    try:
        # 1. Check question exists
        result = db.execute(
            text("SELECT id FROM questions WHERE id = :qid"),
            {"qid": data.question_id}
        )
        if not result.mappings().first():
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"Question {data.question_id} does not exist",
            )

        # 2. Check answer already exists
        result = db.execute(
            text("SELECT id FROM question_answers WHERE question_id = :qid"),
            {"qid": data.question_id}
        )
        if result.mappings().first():
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail=f"Answer for question {data.question_id} already exists",
            )

        # 3. Insert answer
        result = db.execute(
            text("""
                INSERT INTO question_answers (question_id, answer_text, explanation, created_by)
                VALUES (:question_id, :answer_text, :explanation, :created_by)
                RETURNING id, question_id, answer_text, explanation, created_by, created_at
            """),
            {
                "question_id": data.question_id,
                "answer_text": data.answer_text,
                "explanation": data.explanation,
                "created_by": user_id,
            }
        )
        answer = dict(result.mappings().first())
        db.commit()
        return answer

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


def get_answer_by_question(question_id: int):
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
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
                WHERE qa.question_id = :qid
            """),
            {"qid": question_id}
        )
        row = result.mappings().first()

        if not row:
            raise HTTPException(
                status_code=404, detail=f"No answer found for question {question_id}"
            )

        return dict(row)

    except HTTPException:
        raise
    finally:
        db.close()


def update_answer(question_id: int, data, user_id: int):
    db = SessionLocal()
    try:
        # 1. Check answer exists
        result = db.execute(
            text("SELECT id FROM question_answers WHERE question_id = :qid"),
            {"qid": question_id}
        )
        if not result.mappings().first():
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"No answer found for question {question_id}",
            )

        # 2. Update answer
        result = db.execute(
            text("""
                UPDATE question_answers
                SET answer_text = COALESCE(:answer_text, answer_text),
                    explanation = COALESCE(:explanation, explanation),
                    updated_at = CURRENT_TIMESTAMP
                WHERE question_id = :question_id
                RETURNING id, question_id, answer_text, explanation, created_by, created_at, updated_at
            """),
            {
                "answer_text": data.answer_text,
                "explanation": data.explanation,
                "question_id": question_id,
            }
        )
        updated = dict(result.mappings().first())
        db.commit()
        return updated

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
