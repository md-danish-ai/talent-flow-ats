import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
from io import BytesIO
from app.auth.dependencies import get_current_user


# ---------------------------
# Override get_current_user for all tests
# ---------------------------
def mock_get_current_user():
    return 1  # mock user_id


app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

# ---------------------------
# Sample payload
# ---------------------------
sample_question = {
    "question_type": "multiple_choice",
    "question_text": "What is 2+2?",
    "subject": "Math",
    "marks": 5,
    "difficulty_level": "easy",
    "options": [
        {"option_label": "A", "option_text": "3", "is_correct": False},
        {"option_label": "B", "option_text": "4", "is_correct": True},
    ],
}


# ---------------------------
# Mock repository/service functions
# ---------------------------
@pytest.fixture
def mock_create_question():
    with patch("app.questions.repository.create_question") as mock:
        mock.return_value = {"message": "Question created successfully"}
        yield mock


@pytest.fixture
def mock_get_questions():
    with patch("app.questions.repository.get_questions") as mock:
        mock.return_value = [sample_question]
        yield mock


@pytest.fixture
def mock_update_question():
    with patch("app.questions.repository.update_question_in_db") as mock:
        mock.return_value = {"message": "Question 1 updated successfully"}
        yield mock


@pytest.fixture
def mock_delete_question():
    with patch("app.questions.repository.delete_question") as mock:
        mock.return_value = {"message": "Question 1 deactivated successfully"}
        yield mock


@pytest.fixture
def mock_save_image():
    with patch("app.questions.service.QuestionService.save_image") as mock:
        mock.return_value = "/images/test.png"
        yield mock


# ---------------------------
# Test cases
# ---------------------------
def test_create_question(mock_create_question):
    response = client.post("/questions/", json=sample_question)
    assert response.status_code == 200
    assert response.json() == {"message": "Question created successfully"}


def test_get_questions(mock_get_questions):
    response = client.get("/questions/")
    assert response.status_code == 200
    assert response.json() == [sample_question]


def test_update_question(mock_update_question):
    update_payload = {"question_text": "Updated question"}
    response = client.put("/questions/1", json=update_payload)
    assert response.status_code == 200
    assert response.json() == {"message": "Question 1 updated successfully"}


def test_delete_question(mock_delete_question):
    response = client.delete("/questions/1")
    assert response.status_code == 200
    assert response.json() == {"message": "Question 1 deactivated successfully"}


def test_upload_image(mock_save_image):
    file_content = b"test image content"
    files = {"image": ("test.png", BytesIO(file_content), "image/png")}
    response = client.post("/questions/upload-image", files=files)
    assert response.status_code == 200
    assert response.json() == {
        "message": "Image uploaded successfully",
        "image_url": "/images/test.png",
    }
