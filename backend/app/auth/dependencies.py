from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt import PyJWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/signin")

ALGORITHM = "HS256"


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        current_secret = settings.SECRET_KEY
        payload = jwt.decode(token, current_secret, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        return user_id

    except PyJWTError as e:
        print(f"JWT Verification Failed: {str(e)}")  # Helpful for logs
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
