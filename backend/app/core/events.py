import asyncio
import os
import json
from typing import Callable, Dict, List, Any
import redis.asyncio as redis
from app.utils.logger import logger

class BaseEventManager:
    def subscribe(self, event_type: str, callback: Callable):
        raise NotImplementedError

    async def publish(self, event_type: str, data: Any):
        raise NotImplementedError


class InMemoryEventManager(BaseEventManager):
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)

    async def publish(self, event_type: str, data: Any):
        if event_type in self._subscribers:
            for callback in self._subscribers[event_type]:
                asyncio.create_task(callback(data))


class RedisEventManager(BaseEventManager):
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
        self.pubsub = self.redis.pubsub()
        self._subscribers: Dict[str, List[Callable]] = {}
        self._listener_task = None

    def subscribe(self, event_type: str, callback: Callable):
        if event_type not in self._subscribers:
            self._subscribers[event_type] = []
        self._subscribers[event_type].append(callback)
        
        # In a real async environment, we'd ensure the listener is running
        if not self._listener_task:
            self._listener_task = asyncio.create_task(self._listen())

    async def _listen(self):
        await self.pubsub.psubscribe("*")
        async for message in self.pubsub.listen():
            if message["type"] == "pmessage":
                event_type = message["channel"].decode()
                data = json.loads(message["data"].decode())
                if event_type in self._subscribers:
                    for callback in self._subscribers[event_type]:
                        asyncio.create_task(callback(data))

    async def publish(self, event_type: str, data: Any):
        await self.redis.publish(event_type, json.dumps(data))


# Global instance
redis_url = os.environ.get("REDIS_URL")
if redis_url:
    logger.info("Initializing Redis Event Bus")
    event_bus = RedisEventManager(redis_url)
else:
    logger.info("Initializing In-Memory Event Bus (Fallback)")
    event_bus = InMemoryEventManager()

# --- Pre-defined Handlers ---

async def handle_mission_completed(data: dict):
    """Updates city health and analytics when a mission is verified/completed."""
    mission_id = data.get("mission_id")
    print(f"[EVENT] MissionCompleted handled for {mission_id}. Updating City Health...")
    
    # Create notification
    from app.db.firestore_client import FirestoreClient
    from app.services.notification_service import NotificationService
    from app.schemas.notification import NotificationCreate
    
    svc = NotificationService(FirestoreClient())
    await svc.create_notification(NotificationCreate(
        title="Mission Completed",
        message=f"Mission {mission_id} has been successfully completed and verified.",
        type="success",
        link=f"/operations"
    ))
    
async def handle_mission_assigned(data: dict):
    """Triggers notifications when crew is dispatched."""
    mission_id = data.get("mission_id")
    print(f"[EVENT] MissionAssigned handled for {mission_id}. Triggering notification...")
    
    # Create notification
    from app.db.firestore_client import FirestoreClient
    from app.services.notification_service import NotificationService
    from app.schemas.notification import NotificationCreate
    
    svc = NotificationService(FirestoreClient())
    await svc.create_notification(NotificationCreate(
        title="Crew Dispatched",
        message=f"A field crew has been dispatched for mission {mission_id}.",
        type="info",
        link=f"/operations"
    ))

# Register handlers
event_bus.subscribe("MissionCompleted", handle_mission_completed)
event_bus.subscribe("MissionAssigned", handle_mission_assigned)
