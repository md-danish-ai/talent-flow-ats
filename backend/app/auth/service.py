# app/auth/service.py

from sqlalchemy import text
from app.database.db import SessionLocal
from app.auth.utils import hash_password, verify_password, generate_jwt
from fastapi import HTTPException
from app.utils.status_codes import StatusCode


def signup_user(data):
    db = SessionLocal()
    try:
        result = db.execute(
            text("SELECT id FROM users WHERE mobile = :mobile"),
            {"mobile": data.mobile}
        )
        if result.mappings().first():
            raise HTTPException(
                status_code=StatusCode.CONFLICT, detail="Mobile already registered"
            )

        hashed_password = hash_password(data.mobile)

        result = db.execute(
            text("""
                INSERT INTO users (
                    username, mobile, email, password,
                    testlevel, role, is_active, created_by
                )
                VALUES (:name, :mobile, :email, :password, :testlevel, :role, :is_active, :created_by)
                RETURNING id, username, role
            """),
            {
                "name": data.name,
                "mobile": data.mobile,
                "email": data.email,
                "password": hashed_password,
                "testlevel": data.testLevel.value,
                "role": "user",
                "is_active": True,
                "created_by": None,
            }
        )
        user = dict(result.mappings().first())
        db.commit()

        token = generate_jwt(user)
        return {"access_token": token, "user": user}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        db.close()


def signin_user(data):
    db = SessionLocal()
    try:
        result = db.execute(
            text(
                "SELECT id, username, password, role, is_active FROM users WHERE mobile = :mobile"),
            {"mobile": data.mobile}
        )
        user = result.mappings().first()

        if not user:
            raise HTTPException(
                status_code=StatusCode.UNAUTHORIZED, detail="User does not exist"
            )

        user = dict(user)

        if not user["is_active"]:
            raise HTTPException(
                status_code=StatusCode.FORBIDDEN, detail="Account is inactive"
            )

        if not verify_password(data.password, user["password"]):
            raise HTTPException(
                status_code=StatusCode.UNAUTHORIZED, detail="Invalid credentials"
            )

        token = generate_jwt(user)
        return {
            "access_token": token,
            "user": {"id": user["id"], "username": user["username"], "role": user["role"]},
        }
    finally:
        db.close()


def create_admin(data):
    db = SessionLocal()
    try:
        result = db.execute(
            text("SELECT id FROM users WHERE mobile = :mobile"),
            {"mobile": data.mobile}
        )
        if result.mappings().first():
            raise HTTPException(
                status_code=StatusCode.CONFLICT, detail="Mobile already registered"
            )

        hashed_password = hash_password(data.mobile)

        result = db.execute(
            text("""
                INSERT INTO users (
                    username, mobile, email, password,
                    role, is_active, created_by
                )
                VALUES (:name, :mobile, :email, :password, :role, :is_active, :created_by)
                RETURNING id, username, role
            """),
            {
                "name": data.name,
                "mobile": data.mobile,
                "email": data.email,
                "password": hashed_password,
                "role": "admin",
                "is_active": True,
                "created_by": None,
            }
        )
        user = dict(result.mappings().first())
        db.commit()

        token = generate_jwt(user)
        return {"access_token": token, "user": user}

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        db.close()


def get_user_by_id(user_id):
    db = SessionLocal()
    try:
        result = db.execute(
            text("SELECT id, username, mobile, email, role FROM users WHERE id = :id"),
            {"id": user_id}
        )
        user = result.mappings().first()

        if not user:
            return None

        user = dict(user)

        if user["role"] == "user":
            result = db.execute(
                text("SELECT * FROM user_details WHERE user_id = :user_id"),
                {"user_id": user_id}
            )
            details = result.mappings().first()

            if details:
                details = dict(details)
                user["is_submitted"] = details["is_submitted"]
                user["recruitment_details"] = {
                    "personalDetails": details["personal_details"],
                    "familyDetails": details["family_details"],
                    "sourceOfInformation": details["source_of_information"],
                    "educationDetails": details["education_details"],
                    "workExperienceDetails": details["work_experience_details"],
                    "otherDetails": details["other_details"],
                }
            else:
                user["is_submitted"] = False
                user["recruitment_details"] = None
        else:
            user["is_submitted"] = False
            user["recruitment_details"] = None

        return user
    finally:
        db.close()


def get_users_by_role(role: str):
    db = SessionLocal()
    try:
        result = db.execute(
            text("""
                SELECT id, username, mobile, email, role, is_active
                FROM users
                WHERE role = :role
                ORDER BY id DESC
            """),
            {"role": role}
        )
        return [dict(row) for row in result.mappings().all()]
    except Exception as e:
        raise HTTPException(
            status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        db.close()
