# app/questions/repository.py

from sqlalchemy.orm import aliased
from app.database.db import SessionLocal
from app.questions.models import Question
from app.answer.models import QuestionAnswer
from app.classifications.models import Classification


def create_question(data, question_type: str, subject: str, exam_level: str, user_id: int):
    db_session = SessionLocal()
    try:
        new_question = Question(
            question_type=question_type,
            subject_type=subject,
            exam_level=exam_level,
            question_text=data.question_text,
            image_url=data.image_url,
            passage=data.passage,
            marks=data.marks,
            is_active=data.is_active,
            options=[option.model_dump()
                     for option in data.options] if data.options else [],
            created_by=user_id
        )
        db_session.add(new_question)
        db_session.flush()  # To get the ID

        question_id = new_question.id

        if data.answer:
            answer_text = data.answer.answer_text
            if not answer_text and data.options:
                answer_text = ", ".join(
                    [option.option_label for option in data.options if option.is_correct])

            new_answer = QuestionAnswer(
                question_id=question_id,
                answer_text=answer_text or "",
                explanation=data.answer.explanation,
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
    subject:       str = None,
    exam_level:    str = None,
    is_active:     bool = None,
    search:        str = None,
    sort_by:       str = "created_at",
    order:         str = "desc",
    limit:         int = 10,
    offset:        int = 0
):
    db_session = SessionLocal()
    try:
        # Aliases for multiple classification joins
        question_type_alias = aliased(Classification)
        subject_type_alias = aliased(Classification)
        exam_level_alias = aliased(Classification)

        query = db_session.query(
            Question,
            question_type_alias.id.label("qt_id"), question_type_alias.code.label(
                "qt_code"), question_type_alias.type.label("qt_type"), question_type_alias.name.label("qt_name"),
            question_type_alias.extra_metadata.label("qt_metadata"), question_type_alias.is_active.label(
                "qt_is_active"), question_type_alias.sort_order.label("qt_sort_order"),

            subject_type_alias.id.label("st_id"), subject_type_alias.code.label(
                "st_code"), subject_type_alias.type.label("st_type"), subject_type_alias.name.label("st_name"),
            subject_type_alias.extra_metadata.label("st_metadata"), subject_type_alias.is_active.label(
                "st_is_active"), subject_type_alias.sort_order.label("st_sort_order"),

            exam_level_alias.id.label("el_id"), exam_level_alias.code.label(
                "el_code"), exam_level_alias.type.label("el_type"), exam_level_alias.name.label("el_name"),
            exam_level_alias.extra_metadata.label("el_metadata"), exam_level_alias.is_active.label(
                "el_is_active"), exam_level_alias.sort_order.label("el_sort_order")
        )

        query = query.outerjoin(question_type_alias, (question_type_alias.code == Question.question_type) & (
            question_type_alias.type == 'question_type'))
        query = query.outerjoin(subject_type_alias, (subject_type_alias.code == Question.subject_type) & (
            subject_type_alias.type == 'subject'))
        query = query.outerjoin(exam_level_alias, (exam_level_alias.code == Question.exam_level) & (
            exam_level_alias.type == 'exam_level'))

        if question_type is not None:
            query = query.filter(Question.question_type == question_type)
        if subject is not None:
            query = query.filter(Question.subject_type == subject)
        if exam_level is not None:
            query = query.filter(Question.exam_level == exam_level)
        if is_active is not None:
            query = query.filter(Question.is_active == is_active)
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

        row = db_session.query(
            Question,
            question_type_alias.id.label("qt_id"), question_type_alias.code.label(
                "qt_code"), question_type_alias.type.label("qt_type"), question_type_alias.name.label("qt_name"),
            question_type_alias.extra_metadata.label("qt_metadata"), question_type_alias.is_active.label(
                "qt_is_active"), question_type_alias.sort_order.label("qt_sort_order"),

            subject_type_alias.id.label("st_id"), subject_type_alias.code.label(
                "st_code"), subject_type_alias.type.label("st_type"), subject_type_alias.name.label("st_name"),
            subject_type_alias.extra_metadata.label("st_metadata"), subject_type_alias.is_active.label(
                "st_is_active"), subject_type_alias.sort_order.label("st_sort_order"),

            exam_level_alias.id.label("el_id"), exam_level_alias.code.label(
                "el_code"), exam_level_alias.type.label("el_type"), exam_level_alias.name.label("el_name"),
            exam_level_alias.extra_metadata.label("el_metadata"), exam_level_alias.is_active.label(
                "el_is_active"), exam_level_alias.sort_order.label("el_sort_order")
        ).outerjoin(question_type_alias, (question_type_alias.code == Question.question_type) & (question_type_alias.type == 'question_type'))\
         .outerjoin(subject_type_alias, (subject_type_alias.code == Question.subject_type) & (subject_type_alias.type == 'subject'))\
         .outerjoin(exam_level_alias, (exam_level_alias.code == Question.exam_level) & (exam_level_alias.type == 'exam_level'))\
         .filter(Question.id == question_id).first()

        return _format_question_orm(row) if row else None
    finally:
        db_session.close()


def update_question(question_id: int, payload, question_type_param: str = None, subject_param: str = None, exam_level_param: str = None):
    db_session = SessionLocal()
    try:
        question = db_session.query(Question).filter(
            Question.id == question_id).first()
        if not question:
            return {"message": f"Question {question_id} not found"}

        data = payload.model_dump(exclude_unset=True)
        answer_data = data.pop("answer", None)
        options_data = data.pop("options", None)

        if question_type_param:
            question.question_type = question_type_param
        if subject_param:
            question.subject_type = subject_param
        if exam_level_param:
            question.exam_level = exam_level_param

        if options_data is not None:
            question.options = options_data

        for key, value in data.items():
            setattr(question, key, value)

        if answer_data:
            answer = db_session.query(QuestionAnswer).filter(
                QuestionAnswer.question_id == question_id).first()
            if answer:
                if "answer_text" in answer_data:
                    answer.answer_text = answer_data["answer_text"]
                if "explanation" in answer_data:
                    answer.explanation = answer_data["explanation"]
            else:
                answer_text = answer_data.get("answer_text")
                if not answer_text and options_data:
                    answer_text = ", ".join(
                        [option.get("option_label", "") for option in options_data if option.get("is_correct")])

                # If no answer exists, create one (optional, based on logic)
                new_answer_obj = QuestionAnswer(
                    question_id=question_id,
                    answer_text=answer_text or "",
                    explanation=answer_data.get("explanation", "")
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
        question = db_session.query(Question).filter(
            Question.id == question_id).first()
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
        question = db_session.query(Question).filter(
            Question.id == question_id).first()
        if not question:
            return {"message": f"Question {question_id} not found"}
        question.is_active = not question.is_active
        db_session.commit()
        return {
            "message": f"Question {question_id} {'activated' if question.is_active else 'deactivated'} successfully",
            "is_active": question.is_active
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

    question = row.Question
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

        "question_type": {
            "id":         row.qt_id,
            "code":       row.qt_code,
            "type":       row.qt_type,
            "name":       row.qt_name,
            "metadata":   row.qt_metadata,
            "is_active":  row.qt_is_active,
            "sort_order": row.qt_sort_order,
        } if row.qt_id else None,

        "subject": {
            "id":         row.st_id,
            "code":       row.st_code,
            "type":       row.st_type,
            "name":       row.st_name,
            "metadata":   row.st_metadata,
            "is_active":  row.st_is_active,
            "sort_order": row.st_sort_order,
        } if row.st_id else None,

        "exam_level": {
            "id":         row.el_id,
            "code":       row.el_code,
            "type":       row.el_type,
            "name":       row.el_name,
            "metadata":   row.el_metadata,
            "is_active":  row.el_is_active,
            "sort_order": row.el_sort_order,
        } if row.el_id else None,
    }
