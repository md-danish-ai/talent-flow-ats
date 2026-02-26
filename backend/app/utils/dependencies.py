from typing import List
from fastapi import Request, HTTPException, status
import jwt
from app.core.config import settings

ALGORITHM = "HS256"


def authenticate_user(request: Request) -> int:
    """Helper to verify JWT token from request headers."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id") or payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        # Store user info in request state
        request.state.user_id = user_id
        request.state.user_role = payload.get("role")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


# --- Dependencies (FastAPI Native Approach) ---

def require_roles(allowed_roles: List[str]):
    """Dependency factory to ensure a user has specific roles."""
    def dependency(request: Request):
        authenticate_user(request)
        _check_role(request, allowed_roles)
    return dependency


# --- Internal Helpers ---

def _check_role(request: Request, allowed_roles: List[str]):
    """Check if the user has one of the allowed roles."""
    user_role = getattr(request.state, "user_role", None)
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Role '{user_role}' not authorized. Required: {allowed_roles}"
        )
