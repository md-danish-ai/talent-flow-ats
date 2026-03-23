# app/questions/repository.py

from sqlalchemy.orm import aliased
from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.classifications.models import Classification


def create_question(data, question_type: str = None, subject: str = None, exam_level: str = None, user_id: int = None):
    db_session = SessionLocal()
    try:
        new_question = Question(
            question_type=question_type or getattr(data, 'question_type', None),
            subject_type=subject or getattr(data, 'subject_type', getattr(data, 'subject', None)),
            exam_level=exam_level or getattr(data, 'exam_level', None),
            question_text=data.question_text,
            image_url=data.image_url,
            passage=data.passage,
            marks=getattr(data, 'marks', 1),
            is_active=getattr(data, 'is_active', True),
            options=[option.model_dump() if hasattr(option, 'model_dump') else option
                     for option in data.options] if data.options else [],
            created_by=user_id
        )
        db_session.add(new_question)
        db_session.flush()

        question_id = new_question.id

        if getattr(data, 'answer', None):
            answer_text = getattr(data.answer, 'answer_text', "")
            if not answer_text and data.options:
                # Fallback: if options are provided, try to find correct ones
                if isinstance(data.options, list):
                    correct_labels = []
                    for opt in data.options:
                        if isinstance(opt, dict) and opt.get('is_correct'):
                            correct_labels.append(opt.get('option_label', ''))
                        elif hasattr(opt, 'is_correct') and opt.is_correct:
                            correct_labels.append(getattr(opt, 'option_label', ''))
                    if correct_labels:
                        answer_text = ", ".join(correct_labels)

            new_answer = QuestionAnswer(
                question_id=question_id,
                answer_text=answer_text or "",
                explanation=getattr(data.answer, 'explanation', ""),
                created_by=user_id
            )
            db_session.add(new_answer)

        db_session.commit()
        return {"message": "Question created successfully", "id": question_id}

    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

def get_questions(
    question_type: str = None,
    subject: str = None,
    exam_level: str = None,
    is_active: bool = None,
    marks: int = None,
    search: str = None,
    sort_by: str = "created_at",
    order: str = "desc",
    limit: int = 10,
    offset: int = 0,
):
    db_session = SessionLocal()
    try:
        question_type_alias = aliased(Classification)
        subject_type_alias = aliased(Classification)
        exam_level_alias = aliased(Classification)

        query = db_session.query(
            Question,
            QuestionAnswer.answer_text.label("ans_text"),
            QuestionAnswer.explanation.label("ans_explanation"),
            question_type_alias.id.label("qt_id"),
            question_type_alias.code.label("qt_code"),
            question_type_alias.type.label("qt_type"),
            question_type_alias.name.label("qt_name"),
            question_type_alias.extra_metadata.label("qt_metadata"),
            question_type_alias.is_active.label("qt_is_active"),
            question_type_alias.sort_order.label("qt_sort_order"),
            subject_type_alias.id.label("st_id"),
            subject_type_alias.code.label("st_code"),
            subject_type_alias.type.label("st_type"),
            subject_type_alias.name.label("st_name"),
            subject_type_alias.extra_metadata.label("st_metadata"),
            subject_type_alias.is_active.label("st_is_active"),
            subject_type_alias.sort_order.label("st_sort_order"),
            exam_level_alias.id.label("el_id"),
            exam_level_alias.code.label("el_code"),
            exam_level_alias.type.label("el_type"),
            exam_level_alias.name.label("el_name"),
            exam_level_alias.extra_metadata.label("el_metadata"),
            exam_level_alias.is_active.label("el_is_active"),
            exam_level_alias.sort_order.label("el_sort_order"),
        )

        query = query.outerjoin(
            QuestionAnswer, QuestionAnswer.question_id == Question.id
        )

        query = query.outerjoin(
            question_type_alias,
            (question_type_alias.code == Question.question_type)
            & (question_type_alias.type == "question_type"),
        )
        query = query.outerjoin(
            subject_type_alias,
            (subject_type_alias.code == Question.subject_type)
            & (subject_type_alias.type == "subject_type"),
        )
        query = query.outerjoin(
            exam_level_alias,
            (exam_level_alias.code == Question.exam_level)
            & (exam_level_alias.type == "exam_level"),
        )

        if question_type is not None:
            query = query.filter(Question.question_type == question_type)
        if subject is not None:
            query = query.filter(Question.subject_type == subject)
        if exam_level is not None:
            query = query.filter(Question.exam_level == exam_level)
        if is_active is not None:
            query = query.filter(Question.is_active == is_active)
        if marks is not None:
            query = query.filter(Question.marks == marks)
        if search:
            query = query.filter(Question.question_text.ilike(f"%{search}%"))

        total_records = query.count()

        sort_column = getattr(Question, sort_by, Question.created_at)
        if order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        results = query.offset(offset).limit(limit).all()
        data = [_format_question_orm(row) for row in results]

        return data, total_records
    finally:
        db_session.close()

def get_question_by_id(question_id: int):
    db_session = SessionLocal()
    try:
        question_type_alias = aliased(Classification)
        subject_type_alias = aliased(Classification)
        exam_level_alias = aliased(Classification)

        row = (
            db_session.query(
                Question,
                QuestionAnswer.answer_text.label("ans_text"),
                QuestionAnswer.explanation.label("ans_explanation"),
                question_type_alias.id.label("qt_id"),
                question_type_alias.code.label("qt_code"),
                question_type_alias.type.label("qt_type"),
                question_type_alias.name.label("qt_name"),
                question_type_alias.extra_metadata.label("qt_metadata"),
                question_type_alias.is_active.label("qt_is_active"),
                question_type_alias.sort_order.label("qt_sort_order"),
                subject_type_alias.id.label("st_id"),
                subject_type_alias.code.label("st_code"),
                subject_type_alias.type.label("st_type"),
                subject_type_alias.name.label("st_name"),
                subject_type_alias.extra_metadata.label("st_metadata"),
                subject_type_alias.is_active.label("st_is_active"),
                subject_type_alias.sort_order.label("st_sort_order"),
                exam_level_alias.id.label("el_id"),
                exam_level_alias.code.label("el_code"),
                exam_level_alias.type.label("el_type"),
                exam_level_alias.name.label("el_name"),
                exam_level_alias.extra_metadata.label("el_metadata"),
                exam_level_alias.is_active.label("el_is_active"),
                exam_level_alias.sort_order.label("el_sort_order"),
            )
            .outerjoin(QuestionAnswer, QuestionAnswer.question_id == Question.id)
            .outerjoin(
                question_type_alias,
                (question_type_alias.code == Question.question_type)
                & (question_type_alias.type == "question_type"),
            )
            .outerjoin(
                subject_type_alias,
                (subject_type_alias.code == Question.subject_type)
                & (subject_type_alias.type == "subject_type"),
            )
            .outerjoin(
                exam_level_alias,
                (exam_level_alias.code == Question.exam_level)
                & (exam_level_alias.type == "exam_level"),
            )
            .filter(Question.id == question_id)
            .first()
        )

        return _format_question_orm(row) if row else None
    finally:
        db_session.close()


def get_questions_by_ids(question_ids: list[int]):
    if not question_ids:
        return []
    db_session = SessionLocal()
    try:
        question_type_alias = aliased(Classification)
        subject_type_alias = aliased(Classification)
        exam_level_alias = aliased(Classification)

        results = (
            db_session.query(
                Question,
                QuestionAnswer.answer_text.label("ans_text"),
                QuestionAnswer.explanation.label("ans_explanation"),
                question_type_alias.id.label("qt_id"),
                question_type_alias.code.label("qt_code"),
                question_type_alias.type.label("qt_type"),
                question_type_alias.name.label("qt_name"),
                question_type_alias.extra_metadata.label("qt_metadata"),
                question_type_alias.is_active.label("qt_is_active"),
                question_type_alias.sort_order.label("qt_sort_order"),
                subject_type_alias.id.label("st_id"),
                subject_type_alias.code.label("st_code"),
                subject_type_alias.type.label("st_type"),
                subject_type_alias.name.label("st_name"),
                subject_type_alias.extra_metadata.label("st_metadata"),
                subject_type_alias.is_active.label("st_is_active"),
                subject_type_alias.sort_order.label("st_sort_order"),
                exam_level_alias.id.label("el_id"),
                exam_level_alias.code.label("el_code"),
                exam_level_alias.type.label("el_type"),
                exam_level_alias.name.label("el_name"),
                exam_level_alias.extra_metadata.label("el_metadata"),
                exam_level_alias.is_active.label("el_is_active"),
                exam_level_alias.sort_order.label("el_sort_order"),
            )
            .outerjoin(QuestionAnswer, QuestionAnswer.question_id == Question.id)
            .outerjoin(
                question_type_alias,
                (question_type_alias.code == Question.question_type)
                & (question_type_alias.type == "question_type"),
            )
            .outerjoin(
                subject_type_alias,
                (subject_type_alias.code == Question.subject_type)
                & (subject_type_alias.type == "subject"),
            )
            .outerjoin(
                exam_level_alias,
                (exam_level_alias.code == Question.exam_level)
                & (exam_level_alias.type == "exam_level"),
            )
            .filter(Question.id.in_(question_ids))
            .all()
        )

        return [_format_question_orm(row) for row in results]
    finally:
        db_session.close()


def update_question(
    question_id: int,
    payload,
    question_type_param: str = None,
    subject_param: str = None,
    exam_level_param: str = None,
):
    db_session = SessionLocal()
    try:
        question = db_session.query(Question).filter(Question.id == question_id).first()
        if not question:
            return {"message": f"Question {question_id} not found"}

        data = payload.model_dump(exclude_unset=True)
        answer_data = data.pop("answer", None)
        options_data = data.pop("options", None)

        if question_type_param:
            question.question_type = question_type_param
        elif "question_type" in data:
            question.question_type = data.pop("question_type")

        if subject_param:
            question.subject_type = subject_param
        elif "subject_type" in data:
            question.subject_type = data.pop("subject_type")
        elif "subject" in data:
            question.subject_type = data.pop("subject")

        if exam_level_param:
            question.exam_level = exam_level_param
        elif "exam_level" in data:
            question.exam_level = data.pop("exam_level")

        if options_data is not None:
            question.options = options_data

        # Remove classification fields from data as they are handled separately or via params
        data.pop("question_type", None)
        data.pop("subject", None)
        data.pop("exam_level", None)

        for key, value in data.items():
            if hasattr(question, key):
                setattr(question, key, value)

        if answer_data:
            answer = (
                db_session.query(QuestionAnswer)
                .filter(QuestionAnswer.question_id == question_id)
                .first()
            )
            if answer:
                for a_key, a_val in answer_data.items():
                    if hasattr(answer, a_key):
                        setattr(answer, a_key, a_val)
            else:
                answer_text = answer_data.get("answer_text")
                if not answer_text and options_data and isinstance(options_data, list):
                    answer_text = ", ".join(
                        [
                            option.get("option_label", "")
                            for option in options_data
                            if isinstance(option, dict) and option.get("is_correct")
                        ]
                    )

                new_answer_obj = QuestionAnswer(
                    question_id=question_id,
                    answer_text=answer_text or "",
                    explanation=answer_data.get("explanation", ""),
                )
                db_session.add(new_answer_obj)

        db_session.commit()
        return {"message": f"Question {question_id} updated successfully"}
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()

def delete_question(question_id: int):
    db_session = SessionLocal()
    try:
        question = db_session.query(Question).filter(Question.id == question_id).first()
        if question:
            question.is_active = False
            db_session.commit()
        return {"message": f"Question {question_id} deactivated successfully"}
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


def toggle_question_status(question_id: int):
    db_session = SessionLocal()
    try:
        question = db_session.query(Question).filter(Question.id == question_id).first()
        if not question:
            return {"message": f"Question {question_id} not found"}
        question.is_active = not question.is_active
        db_session.commit()
        return {
            "message": f"Question {question_id} {'activated' if question.is_active else 'deactivated'} successfully",
            "is_active": question.is_active,
        }
    except Exception as exception:
        db_session.rollback()
        raise exception
    finally:
        db_session.close()


# ─── Helper ───────────────────────────────────────────────────────────────────


def _format_question_orm(row) -> dict:
    if not row:
        return None

    # Handle both Joined result (row object) and single Question object
    if hasattr(row, 'Question'):
        question = row.Question
    else:
        # Fallback if it's just a Question object (though rich logic prefers row)
        question = row
        return {
            "id":            question.id,
            "question_text": question.question_text,
            "image_url":     question.image_url,
            "passage":       question.passage,
            "marks":         question.marks,
            "is_active":     question.is_active,
            "options":       question.options,
            "created_at":    str(question.created_at),
            "updated_at":    str(question.updated_at),
            "question_type": question.question_type,
            "subject_type":  question.subject_type,
            "exam_level":    question.exam_level
        }

    return {
        "id": question.id,
        "question_text": question.question_text,
        "image_url": question.image_url,
        "passage": question.passage,
        "marks": question.marks,
        "is_active": question.is_active,
        "options": question.options,
        "created_at": str(question.created_at),
        "updated_at": str(question.updated_at),
        "question_type": {
            "id": row.qt_id,
            "code": row.qt_code,
            "type": row.qt_type,
            "name": row.qt_name,
            "metadata": row.qt_metadata,
            "is_active": row.qt_is_active,
            "sort_order": row.qt_sort_order,
        } if getattr(row, 'qt_id', None) else question.question_type,
        "subject": {
            "id": row.st_id,
            "code": row.st_code,
            "type": row.st_type,
            "name": row.st_name,
            "metadata": row.st_metadata,
            "is_active": row.st_is_active,
            "sort_order": row.st_sort_order,
        } if getattr(row, 'st_id', None) else question.subject_type,
        "exam_level": {
            "id": row.el_id,
            "code": row.el_code,
            "type": row.el_type,
            "name": row.el_name,
            "metadata": row.el_metadata,
            "is_active": row.el_is_active,
            "sort_order": row.el_sort_order,
        } if getattr(row, 'el_id', None) else question.exam_level,
        "answer": {
            "answer_text": row.ans_text,
            "explanation": row.ans_explanation,
        }
        if hasattr(row, "ans_text") and row.ans_text is not None
        else None,
    }

