from app.utils.status_codes import api_response, StatusCode, ResponseMessage
from typing import Any, Optional

class ResponseHandler:
    @staticmethod
    def success(data: Any = None, message: str = ResponseMessage.SUCCESS, status_code: int = StatusCode.OK, pagination: Any = None):
        """
        Returns a successful API response using the standard api_response helper.
        """
        return api_response(
            status_code=status_code,
            message=message,
            data=data,
            pagination=pagination
        )

    @staticmethod
    def error(message: str = ResponseMessage.INTERNAL_ERROR, status_code: int = StatusCode.INTERNAL_SERVER_ERROR, errors: Any = None):
        """
        Returns an error API response using the standard api_response helper.
        """
        return api_response(
            status_code=status_code,
            message=message,
            errors=errors
        )
