import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ─────────────────────────────────────────
# SIGNUP TEST CASES
# ─────────────────────────────────────────

def test_signup_success():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "9000000001",
        "testLevel": "fresher",
        "email": "testuser@example.com"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Signup successfully"
    assert "token" in data
    assert data["user"]["username"] == "test user"
    assert data["user"]["role"] == "user"


def test_signup_success_without_email():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "9000000002",
        "testLevel": "fresher"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Signup successfully"


def test_signup_duplicate_mobile():
    payload = {
        "name": "test user",
        "mobile": "9000000003",
        "testLevel": "fresher",
        "email": "testuser3@example.com"
    }
    client.post("/auth/signup", json=payload)
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Mobile already registered"


def test_signup_invalid_mobile_less_than_10_digits():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "12345",
        "testLevel": "fresher"
    })
    assert response.status_code == 422


def test_signup_invalid_mobile_more_than_10_digits():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "12345678901",
        "testLevel": "fresher"
    })
    assert response.status_code == 422


def test_signup_invalid_mobile_with_letters():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "9000abc001",
        "testLevel": "fresher"
    })
    assert response.status_code == 422


def test_signup_invalid_name_single_word():
    response = client.post("/auth/signup", json={
        "name": "testuser",
        "mobile": "9000000004",
        "testLevel": "fresher"
    })
    assert response.status_code == 422


def test_signup_invalid_name_with_numbers():
    response = client.post("/auth/signup", json={
        "name": "test user123",
        "mobile": "9000000005",
        "testLevel": "fresher"
    })
    assert response.status_code == 422


def test_signup_invalid_testlevel():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "9000000006",
        "testLevel": "expert"  # not in enum
    })
    assert response.status_code == 422


def test_signup_invalid_email_format():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "9000000007",
        "testLevel": "fresher",
        "email": "notanemail"
    })
    assert response.status_code == 422


def test_signup_missing_required_fields():
    response = client.post("/auth/signup", json={})
    assert response.status_code == 422


def test_signup_default_role_is_user():
    response = client.post("/auth/signup", json={
        "name": "test user",
        "mobile": "9000000008",
        "testLevel": "QA"
    })
    assert response.status_code == 201
    assert response.json()["user"]["role"] == "user"


# ─────────────────────────────────────────
# SIGNIN TEST CASES
# ─────────────────────────────────────────

def test_signin_success():
    client.post("/auth/signup", json={
        "name": "signin user",
        "mobile": "9000000009",
        "testLevel": "fresher"
    })
    response = client.post("/auth/signin", json={
        "mobile": "9000000009",
        "password": "9000000009"  # password = mobile
    })
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Login successfully"
    assert "token" in data
    assert "user" in data


def test_signin_user_not_exist():
    response = client.post("/auth/signin", json={
        "mobile": "9999999999",
        "password": "9999999999"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "User does not exist"


def test_signin_wrong_password():
    client.post("/auth/signup", json={
        "name": "signin user",
        "mobile": "9000000010",
        "testLevel": "fresher"
    })
    response = client.post("/auth/signin", json={
        "mobile": "9000000010",
        "password": "1234567890"  # wrong password
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "User does not exist"


def test_signin_invalid_mobile_format():
    response = client.post("/auth/signin", json={
        "mobile": "12345",
        "password": "1234567890"
    })
    assert response.status_code == 422


def test_signin_invalid_password_format():
    response = client.post("/auth/signin", json={
        "mobile": "9000000009",
        "password": "abc"  # not 10 digits
    })
    assert response.status_code == 422


def test_signin_missing_fields():
    response = client.post("/auth/signin", json={})
    assert response.status_code == 422


# ─────────────────────────────────────────
# CREATE ADMIN TEST CASES
# ─────────────────────────────────────────

def test_create_admin_success():
    response = client.post("/auth/create-admin", json={
        "name": "admin user",
        "mobile": "8000000001",
        "email": "admin@example.com"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Admin created successfully"
    assert data["user"]["role"] == "admin"
    assert "token" in data


def test_create_admin_duplicate_mobile():
    payload = {
        "name": "admin user",
        "mobile": "8000000002",
        "email": "admin2@example.com"
    }
    client.post("/auth/create-admin", json=payload)
    response = client.post("/auth/create-admin", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Mobile already registered"


def test_create_admin_without_email():
    response = client.post("/auth/create-admin", json={
        "name": "admin user",
        "mobile": "8000000003"
    })
    assert response.status_code == 201


def test_create_admin_invalid_mobile():
    response = client.post("/auth/create-admin", json={
        "name": "admin user",
        "mobile": "12345"
    })
    assert response.status_code == 422


def test_create_admin_invalid_name():
    response = client.post("/auth/create-admin", json={
        "name": "adminuser",
        "mobile": "8000000004"
    })
    assert response.status_code == 422


def test_create_admin_invalid_email():
    response = client.post("/auth/create-admin", json={
        "name": "admin user",
        "mobile": "8000000005",
        "email": "notanemail"
    })
    assert response.status_code == 422