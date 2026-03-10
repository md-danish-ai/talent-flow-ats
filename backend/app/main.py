import os
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.auth.router import router as auth_router
from app.user_details.router import router as user_details_router
from app.questions.router import router as questions_router
from app.answer.router import router as answer_router
from app.classifications.router import router as classifications_router
from app.interview_attempts.router import router as interview_attempts_router
from app.duplicates.router import router as duplicates_router
from app.core.config import settings
from app.utils.status_codes import StatusCode, ResponseMessage, api_response

app = FastAPI(title="Talent Flow ATS")


# ─────────────────────────────────────────────
#  CORS — must be added before exception handlers
#  so that even error responses get CORS headers
# ─────────────────────────────────────────────

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
#  Global Exception Handlers
# ─────────────────────────────────────────────

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Catch all HTTPExceptions and return a standardized JSON response.
    """
    return api_response(
        status_code=exc.status_code,
        message=str(exc.detail),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Catch all validation errors and return a standardized JSON response.
    """
    return api_response(
        status_code=StatusCode.UNPROCESSABLE_ENTITY,
        message=ResponseMessage.VALIDATION_ERROR,
        errors=exc.errors()
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """
    Catch-all for all unexpected exceptions.
    """
    print(f"CRITICAL ERROR: {str(exc)}")
    import traceback
    traceback.print_exc()
    return api_response(
        status_code=StatusCode.INTERNAL_SERVER_ERROR,
        message=ResponseMessage.INTERNAL_ERROR,
        errors=str(exc)
    )


@app.get("/")
def health_check():
    return {"message": "FastAPI server is running 🚀"}


# Routers
app.include_router(auth_router)
app.include_router(user_details_router)
app.include_router(questions_router)
app.include_router(answer_router)
app.include_router(classifications_router)
app.include_router(interview_attempts_router)
app.include_router(duplicates_router)


# Images
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/images", StaticFiles(directory=settings.UPLOAD_DIR), name="images")


if __name__ == "__main__":
    PORT = int(os.getenv("APP_PORT", 4000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
