import os
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.auth.router import router as auth_router
from app.user_details.router import router as user_details_router
from app.questions.router import router as questions_router
from app.classifications.router import router as classifications_router
from app.ai_questions.router import router as ai_questions_router
from app.interview_attempts.router import router as interview_attempts_router
from app.duplicates.router import router as duplicates_router
from app.departments.router import router as departments_router
from app.papers.router import router as papers_router
from app.paper_assignments.router import router as paper_assignments_router
from app.dashboard.router import router as dashboard_router
from app.core.config import settings
from app.utils.status_codes import StatusCode, ResponseMessage, api_response

app = FastAPI(title="Talent Flow ATS")

# ──────────────────────────────────────────────────────────────────────────────
# 1. CORS CONFIGURATION (Should be added early)
# ──────────────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://192.168.126.238:3000",
        "http://192.168.126.238:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────────────────────────────────────
# 2. STATIC FILES & STORAGE
# ──────────────────────────────────────────────────────────────────────────────

if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/images", StaticFiles(directory=settings.UPLOAD_DIR), name="images")

# ──────────────────────────────────────────────────────────────────────────────
# 3. GLOBAL EXCEPTION HANDLERS
# ──────────────────────────────────────────────────────────────────────────────


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return api_response(
        status_code=exc.status_code,
        message=str(exc.detail),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return api_response(
        status_code=StatusCode.UNPROCESSABLE_ENTITY,
        message=ResponseMessage.VALIDATION_ERROR,
        errors=exc.errors(),
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    print(f"CRITICAL ERROR: {str(exc)}")
    import traceback

    traceback.print_exc()
    return api_response(
        status_code=StatusCode.INTERNAL_SERVER_ERROR,
        message=ResponseMessage.INTERNAL_ERROR,
        errors=str(exc),
    )


# ──────────────────────────────────────────────────────────────────────────────
# 4. API ROUTES
# ──────────────────────────────────────────────────────────────────────────────


@app.get("/")
def health_check():
    return {"message": "FastAPI server is running 🚀"}


app.include_router(auth_router)
app.include_router(user_details_router)
app.include_router(questions_router)
app.include_router(ai_questions_router)
app.include_router(classifications_router)
app.include_router(interview_attempts_router)
app.include_router(duplicates_router)
app.include_router(departments_router)
app.include_router(papers_router)
app.include_router(paper_assignments_router)
app.include_router(dashboard_router)

if __name__ == "__main__":
    PORT = int(os.getenv("APP_PORT", 4000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
