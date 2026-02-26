from enum import IntEnum
from fastapi.responses import JSONResponse
from typing import Any, Optional
from datetime import datetime, date
import json


# ─────────────────────────────────────────────
#  HTTP Status Codes Enum
# ─────────────────────────────────────────────


class StatusCode(IntEnum):
    # 2xx Success
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204

    # 3xx Redirection
    NOT_MODIFIED = 304

    # 4xx Client Errors
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    METHOD_NOT_ALLOWED = 405
    CONFLICT = 409
    UNPROCESSABLE_ENTITY = 422
    TOO_MANY_REQUESTS = 429

    # 5xx Server Errors
    INTERNAL_SERVER_ERROR = 500
    NOT_IMPLEMENTED = 501
    BAD_GATEWAY = 502
    SERVICE_UNAVAILABLE = 503


# ─────────────────────────────────────────────
#  Standard API Response Messages
# ─────────────────────────────────────────────


class ResponseMessage:
    # Success
    SUCCESS = "Success"
    CREATED = "data created successfully"
    UPDATED = "data updated successfully"
    DELETED = "data deleted successfully"
    FETCHED = "data fetched successfully"

    # Auth
    LOGIN_SUCCESS = "Login successful"
    LOGOUT_SUCCESS = "Logout successful"
    TOKEN_EXPIRED = "Token has expired"
    TOKEN_INVALID = "Invalid token"
    UNAUTHORIZED = "Unauthorized access"
    FORBIDDEN = "You do not have permission to perform this action"

    # Errors
    BAD_REQUEST = "Bad request"
    NOT_FOUND = "data not found"
    CONFLICT = "data already exists"
    VALIDATION_ERROR = "Validation error"
    INTERNAL_ERROR = "An internal server error occurred"
    TOO_MANY_REQUESTS = "Too many requests, please try again later"


# ─────────────────────────────────────────────
#  Custom JSON Encoder (handles datetime, date)
# ─────────────────────────────────────────────


class CustomJSONEncoder(json.JSONEncoder):
    """Handles datetime, date, and other non-serializable types."""

    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)


def serialize(data: Any) -> Any:
    """Recursively convert non-serializable objects (datetime, etc.) to JSON-safe types."""
    return json.loads(json.dumps(data, cls=CustomJSONEncoder))


# ─────────────────────────────────────────────
#  Helper: Standard JSON Response Builder
# ─────────────────────────────────────────────


def api_response(
    status_code: int,
    message: str,
    data: Optional[Any] = None,
    errors: Optional[Any] = None,
) -> JSONResponse:
    body = {
        "status": status_code,
        "message": message,
    }
    if data is not None:
        body["data"] = serialize(data)
    if errors is not None:
        body["errors"] = serialize(errors)

    return JSONResponse(status_code=status_code, content=body)
