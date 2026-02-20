from app.database.db import get_db
from app.auth.utils import hash_password, verify_password, generate_jwt

def signup_user(data):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE mobile=%s", (data.mobile,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {"error": "Mobile already registered"}

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

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}

    finally:
        cur.close()
        conn.close()

    token = generate_jwt(user)

    return {
        "message": "Signup successfully",
        "access_token": token,
        "user": user
    }

def signin_user(data):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""SELECT id, username, password, role, is_active FROM users WHERE mobile=%s""", (data.mobile,))

    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        return {"error": "User does not exist"}
        
    if not user["is_active"]:
        return {"error": "Account is inactive"}

    if not verify_password(data.password, user["password"]):
        return {"error": "User does not exist"}


    token = generate_jwt(user)
    return {
        "message": "Login successfully",
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
        return {"error": "Mobile already registered"}

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

    except Exception as e:
        conn.rollback()
        return {"error": str(e)}

    finally:
        cur.close()
        conn.close()

    token = generate_jwt(user)

    return {
        "message": "Admin created successfully",
        "token": token,
        "user": user
    } 