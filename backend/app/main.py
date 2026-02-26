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
from app.core.config import settings
from app.utils.status_codes import StatusCode, ResponseMessage, api_response

app = FastAPI(title="Talent Flow ATS")


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


# middleware-name: log_requests
# middleware-desc: this middleware is used for logging incoming requests and their origins.
@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    print(
        f"Incoming request: {request.method} {request.url} | Origin: {origin}")
    response = await call_next(request)
    return response


# Set up CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# middleware-name: CORSMiddleware
# middleware-desc: this middleware is used for handling Cross-Origin Resource Sharing (CORS) to allow requests from specified origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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


# Images
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/images", StaticFiles(directory=settings.UPLOAD_DIR), name="images")


if __name__ == "__main__":
    PORT = int(os.getenv("APP_PORT", 4000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)
