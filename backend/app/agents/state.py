from typing import Annotated, TypedDict, List, Dict, Any, Optional
import operator

class AuditEntry(TypedDict):
    agent: str
    action: str
    timestamp: str
    reasoning: str
    confidence: float
    output: Any

class GraphState(TypedDict):
    """The shared state for the CityOS AI LangGraph pipeline."""
    
    # Core Issue Data (Inputs)
    issue_id: str
    title: str
    description: str
    images: List[str]
    lat: float
    lng: float
    reporter_id: str
    
    # Orchestration Flags
    is_valid: bool
    requires_vision: bool
    skip_processing: bool
    
    # Agent 2: Classification
    category: Optional[str]
    sub_category: Optional[str]
    urgency: Optional[str]
    classification_confidence: Optional[float]
    
    # Agent 3: Vision Analysis
    vision_summary: Optional[str]
    objects_detected: List[str]
    vision_confidence: Optional[float]
    
    # Agent 4: Duplicate Detection
    is_duplicate: bool
    duplicate_of: Optional[str]
    
    # Agent 5: Geo Intelligence
    nearby_infrastructure: List[str]
    affected_population_estimate: Optional[int]
    
    # Agent 7: Infrastructure Intelligence
    cascading_effects: List[str]
    
    # Agent 6: Risk Assessment
    safety_risk_score: Optional[int] 
    infrastructure_impact_score: Optional[int] 
    overall_priority: Optional[str]
    risk_rationale: Optional[str]
    
    # Agent 8: Department Router
    assigned_department: Optional[str]
    routing_confidence: Optional[float]
    
    # Agent 9: Mission Planning
    mission_title: Optional[str]
    mission_description: Optional[str]
    mission_priority: Optional[str]
    estimated_duration_hours: Optional[float]
    required_skills: List[str]
    
    # Agent 10: Resource Allocation
    crew_size: Optional[int]
    vehicles_required: List[str]
    equipment_required: List[str]
    
    # Agent 11: Citizen Communication
    citizen_message: Optional[str]
    
    # Audit Log (Append-only reducer)
    audit_log: Annotated[List[AuditEntry], operator.add]
    
    # Error handling
    error: Optional[str]
