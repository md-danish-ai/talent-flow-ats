from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI

# ── App setup ────────────────────────────────────────────────────────────────
# Adjust import path to match your project structure
from app.answer.router import router
from app.auth.dependencies import get_current_user

app = FastAPI()
app.include_router(router)

# Override auth dependency so tests don't need a real JWT
app.dependency_overrides[get_current_user] = lambda: 1  # mock user_id = 1

client = TestClient(app)

# ── Shared fixtures ───────────────────────────────────────────────────────────
MOCK_ANSWER = {
    "id": 1,
    "question_id": 10,
    "answer_text": "Stack",
    "explanation": "Stack follows LIFO principle.",
    "created_by": 1,
    "created_at": "2026-02-24T10:00:00Z",
}

MOCK_ANSWER_WITH_QUESTION = {
    **MOCK_ANSWER,
    "question_text": "Which data structure uses LIFO principle?",
    "question_type": "multiple_choice",
}

MOCK_UPDATED_ANSWER = {
    **MOCK_ANSWER,
    "answer_text": "Updated answer text",
    "explanation": "Updated explanation.",
    "updated_at": "2026-02-24T12:00:00Z",
}


# ═══════════════════════════════════════════════════════════════════════════════
# POST /answers/  — Create Answer
# ═══════════════════════════════════════════════════════════════════════════════
class TestCreateAnswer:
    PAYLOAD = {
        "question_id": 10,
        "answer_text": "Stack",
        "explanation": "Stack follows LIFO principle.",
    }

    @patch("app.answer.repository.create_answer", return_value=MOCK_ANSWER)
    def test_create_answer_success(self, mock_repo):
        """201 — valid payload creates an answer."""
        response = client.post("/answers/", json=self.PAYLOAD)
        assert response.status_code == 201
        data = response.json()["data"]
        assert data["question_id"] == self.PAYLOAD["question_id"]
        assert data["answer_text"] == self.PAYLOAD["answer_text"]
        assert data["explanation"] == self.PAYLOAD["explanation"]

    @patch("app.answer.repository.create_answer")
    def test_create_answer_question_not_found(self, mock_repo):
        """404 — question_id does not exist."""
        from fastapi import HTTPException

        mock_repo.side_effect = HTTPException(
            status_code=404, detail="Question 10 does not exist"
        )
        response = client.post("/answers/", json=self.PAYLOAD)
        assert response.status_code == 404
        assert "does not exist" in response.json()["detail"]

    @patch("app.answer.repository.create_answer")
    def test_create_answer_duplicate(self, mock_repo):
        """409 — answer already exists for this question."""
        from fastapi import HTTPException

        mock_repo.side_effect = HTTPException(
            status_code=409, detail="Answer for question 10 already exists"
        )
        response = client.post("/answers/", json=self.PAYLOAD)
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]

    def test_create_answer_missing_question_id(self):
        """422 — question_id is required."""
        payload = {"answer_text": "Stack", "explanation": "LIFO"}
        response = client.post("/answers/", json=payload)
        assert response.status_code == 422

    def test_create_answer_missing_answer_text(self):
        """422 — answer_text is required."""
        payload = {"question_id": 10, "explanation": "LIFO"}
        response = client.post("/answers/", json=payload)
        assert response.status_code == 422

    @patch("app.answer.repository.create_answer")
    def test_create_answer_server_error(self, mock_repo):
        """500 — unexpected DB error is caught."""
        mock_repo.side_effect = Exception("DB connection failed")
        response = client.post("/answers/", json=self.PAYLOAD)
        assert response.status_code == 500

    @patch("app.answer.repository.create_answer", return_value=MOCK_ANSWER)
    def test_create_answer_without_explanation(self, mock_repo):
        """201 — explanation is optional."""
        payload = {"question_id": 10, "answer_text": "Stack"}
        response = client.post("/answers/", json=payload)
        assert response.status_code == 201


# ═══════════════════════════════════════════════════════════════════════════════
# GET /answers/{question_id}  — Get Answer
# ═══════════════════════════════════════════════════════════════════════════════
class TestGetAnswer:
    @patch(
        "app.answer.repository.get_answer_by_question",
        return_value=MOCK_ANSWER_WITH_QUESTION,
    )
    def test_get_answer_success(self, mock_repo):
        """200 — returns answer joined with question details."""
        response = client.get("/answers/10")
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["question_id"] == 10
        assert data["question_text"] == "Which data structure uses LIFO principle?"
        assert data["question_type"] == "multiple_choice"

    @patch("app.answer.repository.get_answer_by_question")
    def test_get_answer_not_found(self, mock_repo):
        """404 — no answer exists for this question."""
        from fastapi import HTTPException

        mock_repo.side_effect = HTTPException(
            status_code=404, detail="No answer found for question 99"
        )
        response = client.get("/answers/99")
        assert response.status_code == 404
        assert "No answer found" in response.json()["detail"]

    def test_get_answer_invalid_question_id(self):
        """422 — question_id must be an integer."""
        response = client.get("/answers/abc")
        assert response.status_code == 422

    @patch("app.answer.repository.get_answer_by_question")
    def test_get_answer_server_error(self, mock_repo):
        """500 — unexpected DB error is caught."""
        mock_repo.side_effect = Exception("DB timeout")
        response = client.get("/answers/10")
        assert response.status_code == 500

    @patch(
        "app.answer.repository.get_answer_by_question",
        return_value=MOCK_ANSWER_WITH_QUESTION,
    )
    def test_get_answer_response_has_required_fields(self, mock_repo):
        """200 — response contains all expected keys."""
        response = client.get("/answers/10")
        data = response.json()["data"]
        for key in [
            "id",
            "question_id",
            "answer_text",
            "explanation",
            "created_by",
            "question_text",
            "question_type",
        ]:
            assert key in data, f"Missing key: {key}"


# ═══════════════════════════════════════════════════════════════════════════════
# PUT /answers/{question_id}  — Update Answer
# ═══════════════════════════════════════════════════════════════════════════════
class TestUpdateAnswer:
    PAYLOAD = {
        "answer_text": "Updated answer text",
        "explanation": "Updated explanation.",
    }

    @patch("app.answer.repository.update_answer", return_value=MOCK_UPDATED_ANSWER)
    def test_update_answer_success(self, mock_repo):
        """200 — valid update returns updated answer."""
        response = client.put("/answers/10", json=self.PAYLOAD)
        assert response.status_code == 200
        data = response.json()["data"]
        assert data["answer_text"] == "Updated answer text"
        assert data["explanation"] == "Updated explanation."
        assert "updated_at" in data

    @patch("app.answer.repository.update_answer")
    def test_update_answer_not_found(self, mock_repo):
        """404 — no answer exists for this question."""
        from fastapi import HTTPException

        mock_repo.side_effect = HTTPException(
            status_code=404, detail="No answer found for question 99"
        )
        response = client.put("/answers/99", json=self.PAYLOAD)
        assert response.status_code == 404
        assert "No answer found" in response.json()["detail"]

    @patch("app.answer.repository.update_answer")
    def test_update_answer_partial_answer_text_only(self, mock_repo):
        """200 — only answer_text provided (explanation stays via COALESCE)."""
        partial = {"answer_text": "Only updating this"}
        mock_repo.return_value = {
            **MOCK_UPDATED_ANSWER,
            "answer_text": "Only updating this",
        }
        response = client.put("/answers/10", json=partial)
        assert response.status_code == 200
        assert response.json()["data"]["answer_text"] == "Only updating this"

    @patch("app.answer.repository.update_answer")
    def test_update_answer_partial_explanation_only(self, mock_repo):
        """200 — only explanation provided (answer_text stays via COALESCE)."""
        partial = {"explanation": "Only updating explanation"}
        mock_repo.return_value = {
            **MOCK_UPDATED_ANSWER,
            "explanation": "Only updating explanation",
        }
        response = client.put("/answers/10", json=partial)
        assert response.status_code == 200
        assert response.json()["data"]["explanation"] == "Only updating explanation"

    def test_update_answer_invalid_question_id(self):
        """422 — question_id must be an integer."""
        response = client.put("/answers/abc", json=self.PAYLOAD)
        assert response.status_code == 422

    @patch("app.answer.repository.update_answer")
    def test_update_answer_server_error(self, mock_repo):
        """500 — unexpected DB error is caught."""
        mock_repo.side_effect = Exception("DB write failed")
        response = client.put("/answers/10", json=self.PAYLOAD)
        assert response.status_code == 500

    @patch("app.answer.repository.update_answer", return_value=MOCK_UPDATED_ANSWER)
    def test_update_answer_empty_payload(self, mock_repo):
        """200 — empty payload still hits endpoint (COALESCE keeps existing values)."""
        response = client.put("/answers/10", json={})
        assert response.status_code == 200
