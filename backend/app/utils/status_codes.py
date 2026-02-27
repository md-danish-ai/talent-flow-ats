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
    SUCCESS = "Request processed successfully."
    CREATED = "Record created successfully."
    UPDATED = "Record updated successfully."
    DELETED = "Record deleted successfully."
    FETCHED = "Data retrieved successfully."

    # Auth
    LOGIN_SUCCESS = "Logged in successfully."
    LOGOUT_SUCCESS = "Logged out successfully."
    TOKEN_EXPIRED = "Your session has expired. Please log in again."
    TOKEN_INVALID = "Invalid authentication token."
    UNAUTHORIZED = "Authentication is required to access this resource."
    FORBIDDEN = "Access denied: You do not have permission for this request."

    # Errors
    BAD_REQUEST = "The request could not be processed due to invalid input."
    NOT_FOUND = "The requested resource could not be found."
    CONFLICT = "The resource you are trying to create already exists."
    VALIDATION_ERROR = "One or more validation errors occurred."
    INTERNAL_ERROR = "An unexpected error occurred on the server."
    TOO_MANY_REQUESTS = "Too many requests. Please try again later."


# ─────────────────────────────────────────────
#  Custom JSON Encoder (handles datetime, date)
# ─────────────────────────────────────────────


class CustomJSONEncoder(json.JSONEncoder):
    """Handles datetime, date, and other non-serializable types."""

    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        try:
            return super().default(obj)
        except TypeError:
            return str(obj)


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
