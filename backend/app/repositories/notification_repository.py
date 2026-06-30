from typing import Dict, Any, List
from datetime import datetime
import uuid
from app.repositories.base import BaseRepository

class NotificationRepository(BaseRepository):
    collection_name = "notifications"

    def __init__(self, client):
        super().__init__(client)

    async def create(self, data: Dict[str, Any]) -> str:
        doc_id = data.get("id") or f"notif-{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow().isoformat()
        
        notification_data = {
            "id": doc_id,
            "created_at": now,
            "read": False,
            **data
        }
        
        await super().create(doc_id, notification_data)
        return doc_id

    async def get_recent(self, limit: int = 50) -> List[Dict[str, Any]]:
        if not self.db:
            return []
        # Firestore query ordered by created_at descending
        docs = self.db.db.collection(self.collection_name).order_by("created_at", direction="DESCENDING").limit(limit).stream()
        return [doc.to_dict() for doc in docs]

    async def mark_as_read(self, notification_id: str) -> bool:
        return await self.update(notification_id, {"read": True})

    async def mark_all_as_read(self) -> bool:
        if not self.db:
            return False
        # Get all unread
        docs = self.db.db.collection(self.collection_name).where("read", "==", False).stream()
        batch = self.db.db.batch()
        count = 0
        for doc in docs:
            batch.update(doc.reference, {"read": True})
            count += 1
            if count == 500: # Firestore limit
                batch.commit()
                batch = self.db.db.batch()
                count = 0
        if count > 0:
            batch.commit()
        return True

    async def get_unread_count(self) -> int:
        if not self.db:
            return 0
        docs = self.db.db.collection(self.collection_name).where("read", "==", False).stream()
        # count query could be more efficient with `count()` but stream is fine for this scale
        return len(list(docs))
