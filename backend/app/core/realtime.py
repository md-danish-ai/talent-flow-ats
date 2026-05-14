import asyncio
import json
import logging
from typing import Dict, List, Any
import redis.asyncio as redis
from app.core.config import settings

logger = logging.getLogger(__name__)


class RealtimeManager:
    def __init__(self):
        self.redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
        self.user_queues: Dict[str, List[asyncio.Queue]] = {}
        self.admin_queues: List[asyncio.Queue] = []
        self._pubsub_task = None

    async def _listen_to_redis(self):
        """
        Listen to Redis Pub/Sub and broadcast to local queues.
        """
        r = redis.from_url(self.redis_url, decode_responses=True)
        pubsub = r.pubsub()
        await pubsub.subscribe("notifications")

        # Listening started

        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    payload = json.loads(message["data"])
                    target_id = str(payload.get("target_id", "admin"))
                    data = payload.get("data")

                    # Broadcast to local queues in THIS worker
                    target_queues = []
                    if target_id == "admin":
                        target_queues = list(self.admin_queues)
                    else:
                        target_queues = list(self.user_queues.get(target_id, []))

                    for queue in target_queues:
                        try:
                            queue.put_nowait(json.dumps(data, default=str))
                        except Exception as e:
                            logger.error(f"Realtime: Queue put failed: {e}")
        except Exception as e:
            logger.error(f"Realtime: Redis error: {e}")
        finally:
            await pubsub.unsubscribe("notifications")

    def ensure_listener(self):
        if self._pubsub_task is None or self._pubsub_task.done():
            self._pubsub_task = asyncio.create_task(self._listen_to_redis())

    async def subscribe(self, user_id: str = None) -> asyncio.Queue:
        self.ensure_listener()
        queue = asyncio.Queue()
        user_id_str = (
            str(user_id) if user_id is not None and str(user_id) != "None" else "admin"
        )

        if user_id_str == "admin":
            self.admin_queues.append(queue)
        else:
            if user_id_str not in self.user_queues:
                self.user_queues[user_id_str] = []
            self.user_queues[user_id_str].append(queue)
        return queue

    async def unsubscribe(self, queue: asyncio.Queue, user_id: str = None):
        user_id_str = (
            str(user_id) if user_id is not None and str(user_id) != "None" else "admin"
        )
        if user_id_str == "admin":
            if queue in self.admin_queues:
                self.admin_queues.remove(queue)
        else:
            if (
                user_id_str in self.user_queues
                and queue in self.user_queues[user_id_str]
            ):
                self.user_queues[user_id_str].remove(queue)

    async def publish(self, data: Any, user_id: str = None):
        """
        Publish an event to Redis. All workers will hear this.
        """
        user_id_str = str(user_id) if user_id is not None else "admin"
        payload = {"target_id": user_id_str, "data": data}

        async with redis.from_url(self.redis_url) as r:
            await r.publish("notifications", json.dumps(payload, default=str))

    def publish_sync(self, data: Any, user_id: str = None):
        # Fallback for sync code
        try:
            loop = asyncio.get_running_loop()
            asyncio.run_coroutine_threadsafe(self.publish(data, user_id), loop)
        except RuntimeError:
            pass


# Global instance
realtime_manager = RealtimeManager()
