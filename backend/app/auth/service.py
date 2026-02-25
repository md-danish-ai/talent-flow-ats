# app/auth/service.py

from app.database.db import SessionLocal
from app.auth.utils import hash_password, verify_password, generate_jwt
from fastapi import HTTPException
from app.utils.status_codes import StatusCode
from app.users.models import User


def signup_user(data):
    db_session = SessionLocal()
    try:
        existing_user = db_session.query(User).filter(User.mobile == data.mobile).first()
        if existing_user:
            raise HTTPException(
                status_code=StatusCode.CONFLICT, detail="Mobile already registered"
            )

        hashed_password = hash_password(data.mobile)

        new_user = User(
            username=data.name,
            mobile=data.mobile,
            email=data.email,
            password=hashed_password,
            testlevel=data.testLevel.value,
            role="user",
            is_active=True,
            created_by=None,
        )
        db_session.add(new_user)
        db_session.commit()
        db_session.refresh(new_user)

        user_data = {
            "id": new_user.id,
            "username": new_user.username,
            "role": new_user.role
        }
        token = generate_jwt(user_data)
        return {"access_token": token, "user": user_data}

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))
    finally:
        db_session.close()


def signin_user(data):
    db_session = SessionLocal()
    try:
        user = db_session.query(User).filter(User.mobile == data.mobile).first()

        if not user:
            raise HTTPException(
                status_code=StatusCode.UNAUTHORIZED, detail="User does not exist"
            )

        if not user.is_active:
            raise HTTPException(
                status_code=StatusCode.FORBIDDEN, detail="Account is inactive"
            )

        if not verify_password(data.password, user.password):
            raise HTTPException(
                status_code=StatusCode.UNAUTHORIZED, detail="Invalid credentials"
            )

        user_data = {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
        token = generate_jwt(user_data)
        return {
            "access_token": token,
            "user": user_data,
        }
    finally:
        db_session.close()


def create_admin(data):
    db_session = SessionLocal()
    try:
        existing_user = db_session.query(User).filter(User.mobile == data.mobile).first()
        if existing_user:
            raise HTTPException(
                status_code=StatusCode.CONFLICT, detail="Mobile already registered"
            )

        hashed_password = hash_password(data.mobile)

        new_admin = User(
            username=data.name,
            mobile=data.mobile,
            email=data.email,
            password=hashed_password,
            role="admin",
            is_active=True,
            created_by=None,
        )
        db_session.add(new_admin)
        db_session.commit()
        db_session.refresh(new_admin)

        user_data = {
            "id": new_admin.id,
            "username": new_admin.username,
            "role": new_admin.role
        }
        token = generate_jwt(user_data)
        return {"access_token": token, "user": user_data}

    except HTTPException:
        raise
    except Exception as exception:
        db_session.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))
    finally:
        db_session.close()


def get_user_by_id(user_id):
    db_session = SessionLocal()
    try:
        user_obj = db_session.query(User).filter(User.id == user_id).first()

        if not user_obj:
            return None

        user = {
            "id": user_obj.id,
            "username": user_obj.username,
            "mobile": user_obj.mobile,
            "email": user_obj.email,
            "role": user_obj.role
        }

        if user["role"] == "user":
            from app.user_details.models import UserDetail
            details = db_session.query(UserDetail).filter(UserDetail.user_id == user_id).first()
            if details:
                user["is_submitted"] = details.is_submitted
                user["recruitment_details"] = {
                    "personalDetails": details.personal_details,
                    "familyDetails": details.family_details,
                    "sourceOfInformation": details.source_of_information,
                    "educationDetails": details.education_details,
                    "workExperienceDetails": details.work_experience_details,
                    "otherDetails": details.other_details,
                }
            else:
                user["is_submitted"] = False
                user["recruitment_details"] = None
        else:
            user["is_submitted"] = False
            user["recruitment_details"] = None

        return user
    finally:
        db_session.close()


def get_users_by_role(role: str):
    db_session = SessionLocal()
    try:
        results = db_session.query(User).filter(User.role == role).order_by(User.id.desc()).all()
        return [
            {
                "id": user.id,
                "username": user.username,
                "mobile": user.mobile,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active
            }
            for user in results
        ]
    except Exception as exception:
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(exception))
    finally:
        db_session.close()
