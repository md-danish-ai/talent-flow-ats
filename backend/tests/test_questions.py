import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
from io import BytesIO
from app.auth.dependencies import get_current_user

# ---------------------------
# Override authentication
# ---------------------------


def mock_get_current_user():
    return 1


app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

# ---------------------------
# Sample payload (MATCHES YOUR SCHEMA)
# ---------------------------
sample_question = {
    "question_type": "MCQ",
    "subject": "GRAMMAR",
    "exam_level": "BEGINNER",
    "question_text": "What is 2+2?",
    "image_url": None,
    "passage": None,
    "marks": 5,
    "is_active": True,
    "options": [
        {"option_label": "A", "option_text": "3", "is_correct": False},
        {"option_label": "B", "option_text": "4", "is_correct": True},
    ],
    "answer": {
        "answer_text": "4",
        "explanation": "2+2 equals 4"
    }
}

# ---------------------------
# Fixtures (PATCH SERVICE LAYER)
# ---------------------------


@pytest.fixture
def mock_create_question():
    with patch("app.questions.service.QuestionService.create_question") as mock:
        mock.return_value = {
            "message": "Question created successfully", "id": 1}
        yield mock


@pytest.fixture
def mock_get_questions():
    with patch("app.questions.service.QuestionService.get_questions") as mock:
        mock.return_value = [sample_question]
        yield mock


@pytest.fixture
def mock_update_question():
    with patch("app.questions.service.QuestionService.update_question") as mock:
        mock.return_value = {"message": "Question 1 updated successfully"}
        yield mock


@pytest.fixture
def mock_delete_question():
    with patch("app.questions.service.QuestionService.delete_question") as mock:
        mock.return_value = {"message": "Question 1 deactivated successfully"}
        yield mock


@pytest.fixture
def mock_save_image():
    with patch("app.questions.service.QuestionService.save_image") as mock:
        mock.return_value = "/images/test.png"
        yield mock


# ---------------------------
# Test Cases
# ---------------------------

def test_create_question(mock_create_question):
    response = client.post("/questions/create", json=sample_question)

    assert response.status_code == 201
    assert response.json()["status"] == 201
    assert response.json()[
        "data"]["message"] == "Question created successfully"


def test_get_questions(mock_get_questions):
    response = client.get("/questions/get")

    assert response.status_code == 200
    assert response.json()["status"] == 200
    assert response.json()["data"] == [sample_question]


def test_update_question(mock_update_question):
    update_payload = {"question_text": "Updated question"}

    response = client.put("/questions/update/1", json=update_payload)

    assert response.status_code == 200
    assert response.json()[
        "data"]["message"] == "Question 1 updated successfully"


def test_delete_question(mock_delete_question):
    response = client.delete("/questions/1")

    assert response.status_code == 200
    assert response.json()[
        "data"]["message"] == "Question 1 deactivated successfully"


def test_upload_image(mock_save_image):
    file_content = b"test image content"
    files = {"image": ("test.png", BytesIO(file_content), "image/png")}

    response = client.post("/questions/upload-image", files=files)

    assert response.status_code == 200
    assert response.json()["data"]["image_url"] == "/images/test.png"
