from typing import Optional, List, Tuple
from datetime import datetime
from pydantic import BaseModel, Field, model_validator
class MissionBase(BaseModel):
    title: str
    issue_id: str
    priority: str
    description: Optional[str] = None
    category: Optional[str] = None
    district: Optional[str] = None
    location: Optional[dict] = None

class MissionCreate(MissionBase):
    pass

class MissionUpdate(BaseModel):
    state: Optional[str] = None
    crew_id: Optional[str] = None
    crew_name: Optional[str] = None
    department_id: Optional[str] = None
    progress: Optional[int] = None
    eta: Optional[str] = None
    aiSummary: Optional[str] = None
    route: Optional[List[Tuple[float, float]]] = None

class Mission(MissionBase):
    id: str
    state: str = "Draft"
    progress: int = 0
    crew_id: Optional[str] = None
    crew_name: Optional[str] = None
    department_id: Optional[str] = None
    eta: Optional[str] = None
    aiSummary: Optional[str] = None
    route: Optional[List[Tuple[float, float]]] = None
    created_at: datetime
    updated_at: datetime
    
    # Store history of state transitions
    history: List[dict] = Field(default_factory=list)

    @model_validator(mode='before')
    @classmethod
    def set_legacy_defaults(cls, data: dict) -> dict:
        if isinstance(data, dict):
            if 'created_at' not in data and 'createdAt' in data:
                data['created_at'] = data['createdAt']
            if 'updated_at' not in data and 'updatedAt' in data:
                data['updated_at'] = data['updatedAt']
            if 'created_at' not in data:
                data['created_at'] = datetime.utcnow()
            if 'updated_at' not in data:
                data['updated_at'] = datetime.utcnow()
            if 'history' not in data:
                data['history'] = []
            if 'state' not in data:
                data['state'] = 'Draft'
            if 'progress' not in data:
                data['progress'] = 0
            if 'priority' not in data:
                data['priority'] = 'medium'
            if 'title' not in data:
                data['title'] = 'Unknown Mission'
            if 'issue_id' not in data:
                data['issue_id'] = 'unknown'
        return data
