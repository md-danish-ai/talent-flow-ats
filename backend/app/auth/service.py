from app.database.db import get_db
from app.auth.utils import hash_password, verify_password, generate_jwt
from fastapi import HTTPException
from app.utils.status_codes import StatusCode


def signup_user(data):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE mobile=%s", (data.mobile,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=StatusCode.CONFLICT, detail="Mobile already registered")

    hashed_password = hash_password(data.mobile)

    try:
        cur.execute("""
            INSERT INTO users (
                username, mobile, email, password,
                testlevel, role, is_active, created_by
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, username, role
        """, (
            data.name,
            data.mobile,
            data.email,
            hashed_password,
            data.testLevel.value,
            "user",
            True,
            None
        ))

        user = cur.fetchone()
        conn.commit()

    except HTTPException:
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    finally:
        cur.close()
        conn.close()

    token = generate_jwt(user)

    return {
        "access_token": token,
        "user": user
    }

def signin_user(data):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, username, password, role, is_active FROM users WHERE mobile=%s", (data.mobile,))

    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=StatusCode.UNAUTHORIZED, detail="User does not exist")

    if not user["is_active"]:
        raise HTTPException(status_code=StatusCode.FORBIDDEN, detail="Account is inactive")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=StatusCode.UNAUTHORIZED, detail="Invalid credentials")

    token = generate_jwt(user)

    return {
        "access_token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "role": user["role"]
        }
    }

def create_admin(data):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE mobile=%s", (data.mobile,))
    if cur.fetchone():
        cur.close()
        conn.close()
        raise HTTPException(status_code=StatusCode.CONFLICT, detail="Mobile already registered")

    hashed_password = hash_password(data.mobile)

    try:
        cur.execute("""
            INSERT INTO users (
                username, mobile, email, password,
                role, is_active, created_by
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, username, role
        """, (
            data.name,
            data.mobile,
            data.email,
            hashed_password,
            "admin",
            True,
            None
        ))

        user = cur.fetchone()
        conn.commit()

    except HTTPException:
        raise

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=StatusCode.INTERNAL_SERVER_ERROR, detail=str(e))

    finally:
        cur.close()
        conn.close()

    token = generate_jwt(user)

    return {
        "access_token": token,
        "user": user
    }

def get_user_by_id(user_id):
    conn = get_db()
    cur = conn.cursor()
    try:
        # Fetch basic info and determine role
        cur.execute("SELECT id, username, mobile, email, role FROM users WHERE id=%s", (user_id,))
        user = cur.fetchone()
        
        if not user:
            return None
        
        user = dict(user)

        # If it's a regular user, fetch the submission status and recruitment details
        if user["role"] == "user":
            cur.execute("""
                SELECT *
                FROM user_details 
                WHERE user_id = %s
            """, (user_id,))
            details = cur.fetchone()
            
            if details:
                details = dict(details)
                user["is_submitted"] = details["is_submitted"]
                user["recruitment_details"] = {
                    "personalDetails": details["personal_details"],
                    "familyDetails": details["family_details"],
                    "sourceOfInformation": details["source_of_information"],
                    "educationDetails": details["education_details"],
                    "workExperienceDetails": details["work_experience_details"],
                    "otherDetails": details["other_details"]
                }
            else:
                user["is_submitted"] = False
                user["recruitment_details"] = None
        else:
            # Admins don't have recruitment details
            user["is_submitted"] = False
            user["recruitment_details"] = None
            
        return user
    finally:
        cur.close()
        conn.close()
