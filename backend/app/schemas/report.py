from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class SafetyRisk(BaseModel):
    type: str
    description: str
    severity: str
    icon: str

class AIConfidence(BaseModel):
    classification: int
    location: int
    severity: int

class TimelineEvent(BaseModel):
    id: str
    event: str
    description: str
    timestamp: datetime
    actor: str

class AgentState(BaseModel):
    vision: str = "pending"
    duplicateCheck: str = "pending"
    riskAssessment: str = "pending"
    departmentRouting: str = "pending"
    planning: str = "pending"
    verification: str = "pending"
    prediction: str = "pending"
    communication: str = "pending"

class GeoLocation(BaseModel):
    lat: float
    lng: float
    address: str
    ward: Optional[str] = None
    zone: Optional[str] = None

class ReportCreate(BaseModel):
    title: str
    description: str
    category: str
    priority: str
    location: GeoLocation
    mediaUrls: List[str] = []
    videoUrl: Optional[str] = None
    voiceTranscript: Optional[str] = None
    tags: List[str] = []
    aiSummary: Optional[str] = None
    aiPriorityScore: Optional[float] = None
    aiConfidence: Optional[AIConfidence] = None
    aiSafetyRisks: Optional[List[SafetyRisk]] = None
    aiRawAnalysis: Optional[Dict[str, Any]] = None

class ReportResponse(ReportCreate):
    id: str
    status: str
    reportedBy: str
    reporterName: str
    assignedTo: Optional[str] = None
    assignedDepartment: Optional[str] = None
    upvotes: int = 0
    views: int = 0
    comments: int = 0
    timeline: List[TimelineEvent] = []
    agentState: AgentState = AgentState()
    createdAt: datetime
    updatedAt: datetime

class TimelineAppend(BaseModel):
    event: str
    description: str
    actor: str
    icon: Optional[str] = None
