import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Request

from app.auth.router import router as auth_router
from app.users.router import router as users_router
from app.user_details.router import router as user_details_router
from app.questions.router import router as questions_router
from app.core.config import settings
from app.answer.router import router as answer_router

app = FastAPI(title="Talent Flow ATS")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    print(f"Incoming request: {request.method} {request.url} | Origin: {origin}")
    response = await call_next(request)
    return response


# Set up CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(user_details_router, prefix="/user-details", tags=["User Details"])


@app.get("/")
def health_check():
    return {"message": "FastAPI server is running 🚀"}


# ✅ Run server only when executed directly
if __name__ == "__main__":
    PORT = int(os.getenv("APP_PORT", 4000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=PORT, reload=True)

app.include_router(questions_router)


# create images folder if not exists
if not os.path.exists(settings.UPLOAD_DIR):
    os.makedirs(settings.UPLOAD_DIR)

app.mount("/images", StaticFiles(directory=settings.UPLOAD_DIR), name="images")

app.include_router(answer_router)
