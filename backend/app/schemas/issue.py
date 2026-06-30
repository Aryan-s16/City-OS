from pydantic import BaseModel, Field, model_validator
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

    @model_validator(mode='before')
    @classmethod
    def set_legacy_defaults(cls, data: dict) -> dict:
        if isinstance(data, dict):
            if 'location' not in data:
                data['location'] = {'lat': 0.0, 'lng': 0.0, 'address': 'Unknown Location'}
            if 'images' not in data:
                data['images'] = []
            if 'tags' not in data:
                data['tags'] = []
            if 'createdAt' not in data:
                data['createdAt'] = datetime.utcnow()
            if 'updatedAt' not in data:
                data['updatedAt'] = datetime.utcnow()
            if 'priority' not in data:
                data['priority'] = 'medium'
            if 'category' not in data:
                data['category'] = 'other'
            if 'status' not in data:
                data['status'] = 'open'
        return data

    class Config:
        from_attributes = True
