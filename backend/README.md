# ⚙️ TalentFlow ATS - Backend

Welcome to the backend of **TalentFlow ATS**. This is a high-performance, asynchronous API built with **FastAPI**, designed to handle complex recruitment workflows, candidate assessments, and AI-driven question processing.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **FastAPI** | Modern, high-performance web framework for building APIs with Python. |
| **SQLAlchemy** | SQL Toolkit and Object-Relational Mapper (ORM) for database interactions. |
| **PostgreSQL** | Robust, scalable relational database (via `psycopg2-binary`). |
| **Alembic** | Lightweight database migration tool for SQLAlchemy. |
| **Pydantic v2** | Data validation and settings management using Python type annotations. |
| **PyJWT & Passlib** | Secure JWT-based authentication and password hashing. |
| **Pytest** | Testing framework for ensuring API reliability. |
| **Huggingface & Pillow** | Integration for AI-driven question processing and image handling. |

---

## 📂 Project Structure

The backend follows a modular, repository-based architecture for clean separation of concerns.

```text
backend/
├── app/                  # Main application core
│   ├── main.py           # FastAPI entry point and middleware configuration
│   ├── auth/             # Authentication logic and JWT handling
│   ├── database/         # Database connection and session management
│   ├── users/            # User management and role-based logic
│   ├── papers/           # Assessment paper definitions and logic
│   ├── questions/        # Question bank and AI-driven processing
│   ├── evaluations/      # Interview and test evaluation logic
│   ├── core/             # Global configurations and security settings
│   └── utils/            # Shared helper functions and decorators
├── alembic/              # Database migration scripts and versions
├── scripts/              # Automation scripts (e.g., seeding, deployment)
├── seeds/                # Initial data seeds for various modules
├── tests/                # Automated test suites (Pytest)
├── Dockerfile            # Containerization configuration
└── requirements.txt      # Project dependencies
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10 or higher
- **PostgreSQL**: Installed and running

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/md-danish-ai/talent-flow-ats.git
   cd talent-flow-ats/backend
   ```

2. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🔌 Environment Setup

Create a `.env` file in the root of the `backend/` directory and configure the following variables:

### 🔑 Security & App
- `SECRET_KEY`: A secure random string for JWT signing.
- `APP_PORT`: (Optional) Port to run the FastAPI server (default: `4000`).
- `ACCESS_TOKEN_EXPIRE_MINUTES`: (Optional) Token expiration time.

### 🗄️ Database (PostgreSQL)
- `DB_HOST`: Database server host (e.g., `localhost` or `db`).
- `DB_PORT`: Database port (default: `5432`).
- `DB_NAME`: Name of the PostgreSQL database.
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.

### 🤖 AI & Processing
- `HF_TOKEN`: HuggingFace API token for AI-driven question processing.
- `AI_MAX_TOKENS`: Maximum token limit for AI responses (default: `4000`).

---

### Example `.env` File
```env
# Security
SECRET_KEY=your_super_secret_key_here
APP_PORT=4000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=talentflow_db
DB_USER=postgres
DB_PASSWORD=your_password

# AI Configuration
HF_TOKEN=hf_your_token_here
AI_MAX_TOKENS=4000
```

---

## 🔄 Database Migrations

This project uses Alembic to manage database schema changes.

```bash
# Run all pending migrations
alembic upgrade head

# Create a new migration script
alembic revision --autogenerate -m "description_of_change"
```

---

## 🏃 Running the API

Start the development server using Uvicorn:

```bash
# Run the API with hot-reload
uvicorn app.main:app --reload --port 4000
```
The API documentation will be available at [http://localhost:4000/docs](http://localhost:4000/docs).

---

## 📋 Best Practices

1. **Asynchronous Code**: Always use `async def` for route handlers and database operations where possible.
2. **Schema Validation**: Use Pydantic models for all request and response bodies.
3. **Dependency Injection**: Leverage FastAPI's `Depends` for database sessions and authentication.
4. **Migrations**: Never modify the database schema manually; always use Alembic.

---

## 🛡️ License
© 2026 Arcgate. All rights reserved. Proprietary software for TalentFlow ATS.
