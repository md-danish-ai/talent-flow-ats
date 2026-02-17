from fastapi import FastAPI
import uvicorn
from app.auth.router import router as auth_router
from app.users.router import router as users_router

app = FastAPI(title="Backend project")

app.include_router(auth_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"message": "FastAPI server is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "OK"}


if __name__ == "__main__":
    uvicorn.run(
        "__main__:app",  
        host="127.0.0.1",
        port=4000,
        reload=True
    )
