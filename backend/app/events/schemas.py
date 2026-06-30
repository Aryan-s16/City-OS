from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any, Dict, Optional

class BaseEvent(BaseModel):
    event_id: str
    event_type: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    payload: Dict[str, Any]
    source: Optional[str] = "api"

class IssueCreatedEvent(BaseEvent):
    event_type: str = "IssueCreated"

class IssueUpdatedEvent(BaseEvent):
    event_type: str = "IssueUpdated"
