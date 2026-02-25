from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert
from app.database.db import SessionLocal
from fastapi import HTTPException
from app.utils.status_codes import StatusCode
from app.user_details.schemas import UserDetailsSchema
from app.user_details.models import UserDetail
from app.users.models import User


def save_user_details(user_id: int, data: UserDetailsSchema):
    db_session = SessionLocal()
    try:
        # Convert Pydantic models to JSON-serializable dicts
        personal_details = data.personalDetails.model_dump()
        family_details = [item.model_dump() for item in data.familyDetails]
        source_of_information = data.sourceOfInformation.model_dump()
        education_details = [item.model_dump()
                             for item in data.educationDetails]
        work_experience_details = [
            item.model_dump() for item in data.workExperienceDetails
        ]
        other_details = data.otherDetails.model_dump()

        # Sync name in users table
        username = (
            f"{data.personalDetails.firstName} {data.personalDetails.lastName}".strip()
        )
        user = db_session.query(User).filter(User.id == int(user_id)).first()
        if user:
            user.username = username

        # Upsert logic using PostgreSQL dialect insert
        upsert_stmt = insert(UserDetail).values(
            user_id=int(user_id),
            personal_details=personal_details,
            family_details=family_details,
            source_of_information=source_of_information,
            education_details=education_details,
            work_experience_details=work_experience_details,
            other_details=other_details,
            is_submitted=data.is_submitted
        )

        upsert_stmt = upsert_stmt.on_conflict_do_update(
            index_elements=["user_id"],
            set_={
                "personal_details": upsert_stmt.excluded.personal_details,
                "family_details": upsert_stmt.excluded.family_details,
                "source_of_information": upsert_stmt.excluded.source_of_information,
                "education_details": upsert_stmt.excluded.education_details,
                "work_experience_details": upsert_stmt.excluded.work_experience_details,
                "other_details": upsert_stmt.excluded.other_details,
                "is_submitted": upsert_stmt.excluded.is_submitted,
                "updated_at": func.current_timestamp()
            }
        ).returning(UserDetail.id, UserDetail.is_submitted)

        result = db_session.execute(upsert_stmt)
        row = result.mappings().first()
        
        db_session.commit()
        return {
            "id": row["id"],
            "is_submitted": row["is_submitted"],
            "username": username,
            "message": "User details saved successfully",
        }

    except Exception as exception:
        db_session.rollback()
        print(f"Error saving user details: {str(exception)}")
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))

    finally:
        db_session.close()


def get_user_details(user_id: int):
    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        
        details = db_session.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        if not details:
            return None

        return {
            "is_submitted":        details.is_submitted,
            "username":            user.username,
            "personalDetails":     details.personal_details,
            "familyDetails":       details.family_details,
            "sourceOfInformation": details.source_of_information,
            "educationDetails":    details.education_details,
            "workExperienceDetails": details.work_experience_details,
            "otherDetails":        details.other_details,
        }
    finally:
        db_session.close()
