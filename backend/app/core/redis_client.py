import json
import logging
from typing import Any, Optional
import redis
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize a global redis connection pool
try:
    redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        decode_responses=True,  # Automatically decode responses to strings
        socket_timeout=5,
    )
    # Ping to check connection at startup (optional but good for fail-fast)
    redis_client.ping()
    logger.info(f"Connected to Redis at {settings.REDIS_HOST}:{settings.REDIS_PORT}")
except Exception as e:
    logger.warning(f"Could not connect to Redis: {e}. Caching will be bypassed.")
    redis_client = None


def get_cached_data(key: str) -> Optional[Any]:
    """Retrieve and deserialize JSON data from Redis."""
    if not redis_client:
        return None
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        logger.error(f"Redis get error for key {key}: {e}")
    return None


def set_cached_data(key: str, value: Any, expire_seconds: Optional[int] = None) -> None:
    """Serialize and store JSON data in Redis with optional expiration."""
    if not redis_client:
        return
    try:
        serialized = json.dumps(value)
        if expire_seconds:
            redis_client.setex(key, expire_seconds, serialized)
        else:
            redis_client.set(key, serialized)
    except Exception as e:
        logger.error(f"Redis set error for key {key}: {e}")


def delete_cached_data(key: str) -> None:
    """Delete a key from Redis."""
    if not redis_client:
        return
    try:
        redis_client.delete(key)
    except Exception as e:
        logger.error(f"Redis delete error for key {key}: {e}")
