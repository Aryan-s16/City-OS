from fastapi import APIRouter, Depends
from typing import List, Dict
from app.db.firestore_client import FirestoreClient
from app.services.notification_service import NotificationService
from app.schemas.notification import Notification

router = APIRouter()

def get_notification_service() -> NotificationService:
    return NotificationService(FirestoreClient())

@router.get("/", response_model=List[Notification])
async def get_recent_notifications(
    limit: int = 50,
    service: NotificationService = Depends(get_notification_service)
):
    return await service.get_recent_notifications(limit=limit)

@router.get("/unread-count")
async def get_unread_count(
    service: NotificationService = Depends(get_notification_service)
) -> Dict[str, int]:
    count = await service.get_unread_count()
    return {"count": count}

@router.post("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    service: NotificationService = Depends(get_notification_service)
):
    success = await service.mark_as_read(notification_id)
    return {"success": success}

@router.post("/read-all")
async def mark_all_as_read(
    service: NotificationService = Depends(get_notification_service)
):
    success = await service.mark_all_as_read()
    return {"success": success}
