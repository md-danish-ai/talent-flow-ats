import os
import uvicorn
from fastapi import FastAPI

from app.auth.router import router as auth_router
from app.users.router import router as users_router

app = FastAPI(title="Talent Flow ATS")

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(users_router, prefix="/users", tags=["Users"])

@app.get("/")
def health_check():
    return {"status": "OK"}


# ✅ Run server only when executed directly
if __name__ == "__main__":
    PORT = int(os.getenv("APP_PORT", 4000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=PORT,
        reload=True
    )
