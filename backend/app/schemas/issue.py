from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class GeoLocation(BaseModel):
    lat: float
    lng: float
    address: str
    ward: Optional[str] = None
    zone: Optional[str] = None

class IssueBase(BaseModel):
    title: str
    description: str
    category: str
    priority: str = "medium"
    location: GeoLocation
    images: List[str] = []

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assignedTo: Optional[str] = None
    assignedDepartment: Optional[str] = None
    aiSummary: Optional[str] = None
    aiPriorityScore: Optional[float] = None
    aiPredictedResolutionTime: Optional[float] = None

class IssueResponse(IssueBase):
    id: str
    status: str
    reportedBy: str
    reporterName: str
    assignedTo: Optional[str] = None
    assignedDepartment: Optional[str] = None
    aiSummary: Optional[str] = None
    aiPriorityScore: Optional[float] = None
    aiPredictedResolutionTime: Optional[float] = None
    tags: List[str] = []
    upvotes: int = 0
    views: int = 0
    comments: int = 0
    createdAt: datetime
    updatedAt: datetime
    resolvedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
