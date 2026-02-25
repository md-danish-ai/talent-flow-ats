import json
from sqlalchemy import text
from app.database.db import SessionLocal
from fastapi import HTTPException
from app.utils.status_codes import StatusCode
from app.user_details.schemas import UserDetailsSchema


def save_user_details(user_id: int, data: UserDetailsSchema):
    db = SessionLocal()
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
        db.execute(
            text("UPDATE users SET username = :username WHERE id = :id"),
            {"username": username, "id": int(user_id)}
        )

        result = db.execute(
            text("""
                INSERT INTO user_details (
                    user_id,
                    personal_details,
                    family_details,
                    source_of_information,
                    education_details,
                    work_experience_details,
                    other_details,
                    is_submitted,
                    updated_at
                )
                VALUES (
                    :user_id, :personal_details, :family_details,
                    :source_of_information, :education_details,
                    :work_experience_details, :other_details,
                    :is_submitted, CURRENT_TIMESTAMP
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    personal_details       = EXCLUDED.personal_details,
                    family_details         = EXCLUDED.family_details,
                    source_of_information  = EXCLUDED.source_of_information,
                    education_details      = EXCLUDED.education_details,
                    work_experience_details = EXCLUDED.work_experience_details,
                    other_details          = EXCLUDED.other_details,
                    is_submitted           = EXCLUDED.is_submitted,
                    updated_at             = CURRENT_TIMESTAMP
                RETURNING id, is_submitted
            """),
            {
                "user_id": int(user_id),
                "personal_details": json.dumps(personal_details),
                "family_details": json.dumps(family_details),
                "source_of_information": json.dumps(source_of_information),
                "education_details": json.dumps(education_details),
                "work_experience_details": json.dumps(work_experience_details),
                "other_details": json.dumps(other_details),
                "is_submitted": data.is_submitted,
            }
        )

        row = result.mappings().first()
        db.commit()
        return {
            "id": row["id"],
            "is_submitted": row["is_submitted"],
            "username": username,
            "message": "User details saved successfully",
        }

    except Exception as e:
        db.rollback()
        print(f"Error saving user details: {str(e)}")
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    finally:
        db.close()


def get_user_details(user_id: int):
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
                SELECT ud.*, u.username as current_username
                FROM user_details ud
                JOIN users u ON ud.user_id = u.id
                WHERE ud.user_id = :user_id
            """),
            {"user_id": user_id}
        )
        details = result.mappings().first()

        if not details:
            return None

        details = dict(details)
        return {
            "is_submitted":        details["is_submitted"],
            "username":            details["current_username"],
            "personalDetails":     details["personal_details"],
            "familyDetails":       details["family_details"],
            "sourceOfInformation": details["source_of_information"],
            "educationDetails":    details["education_details"],
            "workExperienceDetails": details["work_experience_details"],
            "otherDetails":        details["other_details"],
        }
    finally:
        db.close()
