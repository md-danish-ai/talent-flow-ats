from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert
from app.database.db import SessionLocal
from fastapi import HTTPException
from app.utils.status_codes import StatusCode
from app.user_details.schemas import UserDetailsSchema
from app.user_details.models import UserDetail
from app.users.models import User
from app.duplicates.service import detect_duplicates
from app.classifications.models import Classification


async def save_user_details(
    user_id: int, data: UserDetailsSchema, run_duplicate_check: bool = True
):
    db_session = SessionLocal()
    try:
        # Convert Pydantic models to JSON-serializable dicts
        personal_details = data.personalDetails.model_dump()
        additional_personal_details = (
            data.additionalPersonalDetails.model_dump()
            if data.additionalPersonalDetails
            else None
        )

        # Fetch relation mapping to populate relation labels if empty
        relations = (
            db_session.query(Classification)
            .filter(Classification.type == "family_relation")
            .all()
        )
        relation_map = {r.code: r.name for r in relations}

        family_details = []
        for item in data.familyDetails:
            item_dict = item.model_dump()
            if not item_dict.get("relationLabel"):
                relation_code = item_dict.get("relation")
                item_dict["relationLabel"] = relation_map.get(
                    relation_code, relation_code
                )
            family_details.append(item_dict)
        source_of_information = data.sourceOfInformation.model_dump()
        education_details = [item.model_dump() for item in data.educationDetails]
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
            if data.personalDetails.email:
                user.email = data.personalDetails.email

        # Upsert logic using PostgreSQL dialect insert
        values_to_insert = {
            "user_id": int(user_id),
            "personal_details": personal_details,
            "additional_personal_details": additional_personal_details,
            "family_details": family_details,
            "source_of_information": source_of_information,
            "education_details": education_details,
            "work_experience_details": work_experience_details,
            "other_details": other_details,
            "is_submitted": data.is_submitted,
        }
        if data.emergency_contact_relation is not None:
            values_to_insert["emergency_contact_relation"] = (
                data.emergency_contact_relation
            )

        upsert_stmt = insert(UserDetail).values(**values_to_insert)

        set_dict = {
            "personal_details": upsert_stmt.excluded.personal_details,
            "additional_personal_details": upsert_stmt.excluded.additional_personal_details,
            "family_details": upsert_stmt.excluded.family_details,
            "source_of_information": upsert_stmt.excluded.source_of_information,
            "education_details": upsert_stmt.excluded.education_details,
            "work_experience_details": upsert_stmt.excluded.work_experience_details,
            "other_details": upsert_stmt.excluded.other_details,
            "is_submitted": upsert_stmt.excluded.is_submitted,
            "updated_at": func.current_timestamp(),
        }
        if data.emergency_contact_relation is not None:
            set_dict["emergency_contact_relation"] = (
                upsert_stmt.excluded.emergency_contact_relation
            )

        upsert_stmt = upsert_stmt.on_conflict_do_update(
            index_elements=["user_id"],
            set_=set_dict,
        ).returning(UserDetail.id, UserDetail.is_submitted)

        result = db_session.execute(upsert_stmt)
        row = result.mappings().first()

        db_session.commit()

        if run_duplicate_check:
            try:
                await detect_duplicates(db_session, int(user_id), data)
            except Exception as dup_err:
                print(f"Error detecting duplicates: {str(dup_err)}")

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
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception)
        )

    finally:
        db_session.close()


def get_user_details(user_id: int):
    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter(User.id == user_id).first()
        if not user:
            return None

        details = (
            db_session.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        )
        if not details:
            return None

        family_details_copy = []
        if details.family_details:
            relations = (
                db_session.query(Classification)
                .filter(Classification.type == "family_relation")
                .all()
            )
            relation_map = {r.code: r.name for r in relations}
            for member in details.family_details:
                member_copy = dict(member)
                if not member_copy.get("relationLabel"):
                    relation_code = member_copy.get("relation")
                    member_copy["relationLabel"] = relation_map.get(
                        relation_code, relation_code
                    )
                family_details_copy.append(member_copy)
        else:
            family_details_copy = details.family_details

        return {
            "is_submitted": details.is_submitted,
            "is_interview_submitted": details.is_interview_submitted,
            "username": user.username,
            "mobile": user.mobile,
            "email": user.email,
            "test_level_id": user.test_level_id,
            "test_level_name": user.test_level.name if user.test_level else None,
            "department_id": user.department_id,
            "department_name": user.department.name if user.department else None,
            "personalDetails": details.personal_details,
            "additionalPersonalDetails": details.additional_personal_details,
            "familyDetails": family_details_copy,
            "sourceOfInformation": details.source_of_information,
            "educationDetails": details.education_details,
            "workExperienceDetails": details.work_experience_details,
            "otherDetails": details.other_details,
            "emergency_contact_relation": details.emergency_contact_relation,
            "assigned_emergency_relation": details.assigned_emergency_relation,
        }
    finally:
        db_session.close()


async def assign_emergency_relation(user_id: int, relation_code: str):
    db_session = SessionLocal()
    try:
        detail = (
            db_session.query(UserDetail).filter(UserDetail.user_id == user_id).first()
        )
        if detail:
            detail.assigned_emergency_relation = relation_code
        else:
            detail = UserDetail(
                user_id=user_id, assigned_emergency_relation=relation_code
            )
            db_session.add(detail)

        db_session.commit()
        return {"user_id": user_id, "assigned_emergency_relation": relation_code}
    except Exception as exception:
        db_session.rollback()
        print(f"Error assigning emergency relation: {str(exception)}")
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception)
        )
    finally:
        db_session.close()
