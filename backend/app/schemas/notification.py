from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    title: str
    message: str
    type: str = "info"  # info, success, warning, error
    link: Optional[str] = None
    read: bool = False

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
