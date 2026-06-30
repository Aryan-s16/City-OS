from typing import List, Dict, Any
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate, Notification
from app.db.firestore_client import FirestoreClient

class NotificationService:
    def __init__(self, db_client: FirestoreClient):
        self.repository = NotificationRepository(db_client)

    async def create_notification(self, notification: NotificationCreate) -> Notification:
        data = notification.model_dump()
        doc_id = await self.repository.create(data)
        doc = await self.repository.get_by_id(doc_id)
        return Notification(**doc)

    async def get_recent_notifications(self, limit: int = 50) -> List[Notification]:
        docs = await self.repository.get_recent(limit)
        return [Notification(**doc) for doc in docs if doc]

    async def mark_as_read(self, notification_id: str) -> bool:
        return await self.repository.mark_as_read(notification_id)

    async def mark_all_as_read(self) -> bool:
        return await self.repository.mark_all_as_read()

    async def get_unread_count(self) -> int:
        return await self.repository.get_unread_count()
