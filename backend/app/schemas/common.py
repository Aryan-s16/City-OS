from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel, Field
from datetime import datetime
import time

T = TypeVar("T")

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ApiResponse(BaseModel, Generic[T]):
    """Standardized API Response wrapper"""
    success: bool
    data: Optional[T] = None
    metadata: Optional[dict[str, Any]] = None
    errors: Optional[List[ErrorDetail]] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    request_id: Optional[str] = None
    processing_time_ms: Optional[float] = None
