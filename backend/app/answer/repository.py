# app/answer/repository.py

from app.database.db import SessionLocal
from fastapi import HTTPException
from app.utils.status_codes import StatusCode
from app.answer.models import QuestionAnswer
from app.questions.models import Question


def create_answer(data, user_id: int):
    db_session = SessionLocal()
    try:
        # 1. Check question exists
        question = db_session.query(Question).filter(Question.id == data.question_id).first()
        if not question:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"Question {data.question_id} does not exist",
            )

        # 2. Check answer already exists
        existing_answer = db_session.query(QuestionAnswer).filter(QuestionAnswer.question_id == data.question_id).first()
        if existing_answer:
            raise HTTPException(
                status_code=StatusCode.CONFLICT,
                detail=f"Answer for question {data.question_id} already exists",
            )

        # 3. Insert answer
        new_answer = QuestionAnswer(
            question_id=data.question_id,
            answer_text=data.answer_text,
            explanation=data.explanation,
            created_by=user_id
        )
        db_session.add(new_answer)
        db_session.commit()
        db_session.refresh(new_answer)
        
        return {
            "id": new_answer.id,
            "question_id": new_answer.question_id,
            "answer_text": new_answer.answer_text,
            "explanation": new_answer.explanation,
            "created_by": new_answer.created_by,
            "created_at": new_answer.created_at
        }

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def get_answer_by_question(question_id: int):
    db_session = SessionLocal()
    try:
        # Joining with Question to get question_text and question_type
        # We can use the relationship if we define it, or just a query join
        result = db_session.query(
            QuestionAnswer.id,
            QuestionAnswer.question_id,
            QuestionAnswer.answer_text,
            QuestionAnswer.explanation,
            QuestionAnswer.created_by,
            QuestionAnswer.created_at,
            Question.question_text,
            Question.question_type
        ).join(Question, Question.id == QuestionAnswer.question_id)\
         .filter(QuestionAnswer.question_id == question_id).first()

        if not result:
            raise HTTPException(
                status_code=404, detail=f"No answer found for question {question_id}"
            )

        return dict(result._mapping)

    except HTTPException:
        raise
    finally:
        db_session.close()


def update_answer(question_id: int, data, user_id: int):
    db_session = SessionLocal()
    try:
        # 1. Check answer exists
        answer = db_session.query(QuestionAnswer).filter(QuestionAnswer.question_id == question_id).first()
        if not answer:
            raise HTTPException(
                status_code=StatusCode.NOT_FOUND,
                detail=f"No answer found for question {question_id}",
            )

        # 2. Update answer
        if data.answer_text is not None:
            answer.answer_text = data.answer_text
        if data.explanation is not None:
            answer.explanation = data.explanation
        
        db_session.commit()
        db_session.refresh(answer)
        
        return {
            "id": answer.id,
            "question_id": answer.question_id,
            "answer_text": answer.answer_text,
            "explanation": answer.explanation,
            "created_by": answer.created_by,
            "created_at": answer.created_at,
            "updated_at": answer.updated_at
        }

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()
