from typing import List
from fastapi import Request, HTTPException, status
import jwt
from app.core.config import settings

ALGORITHM = "HS256"


def authenticate_user(request: Request) -> int:
    """Helper to verify JWT token from request headers or query params."""
    auth_header = request.headers.get("Authorization")
    token = None

    # 1. Try Authorization Header
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]

    # 2. Try 'token' Query Parameter (Fallback for SSE)
    if not token:
        token = request.query_params.get("token")

    # 3. Try 'auth_token' Query Parameter (Just in case)
    if not token:
        token = request.query_params.get("auth_token")

    if not token or token == "undefined" or token == "null":
        print(
            f"AUTH DEBUG: No token found. Headers: {dict(request.headers)}, Params: {dict(request.query_params)}"
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("id") or payload.get("user_id")

        if user_id is None:
            print(f"AUTH DEBUG: Token valid but no user_id in payload: {payload}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        # Store user info in request state
        request.state.user_id = user_id
        request.state.user_role = payload.get("role")
        return user_id
    except jwt.ExpiredSignatureError:
        print("AUTH DEBUG: Token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.PyJWTError as e:
        print(f"AUTH DEBUG: JWT Decode Error: {str(e)}. Token prefix: {token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
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
            detail=f"Role '{user_role}' not authorized. Required: {allowed_roles}",
        )
