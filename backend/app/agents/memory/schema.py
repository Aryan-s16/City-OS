from typing import TypedDict, List, Optional, Dict, Any, Annotated
import operator

def append_list(a: List, b: List) -> List:
    if a is None:
        a = []
    if b is None:
        b = []
    return a + b

class AgentLog(TypedDict):
    agent: str
    timestamp: str
    message: str
    type: str # "info", "error", "decision"

class TimelineEvent(TypedDict):
    id: str
    event: str
    description: str
    timestamp: str
    actor: str
    icon: Optional[str]

class VisionResult(TypedDict):
    title: str
    description: str
    category: str
    priority: str
    confidence: Dict[str, int]
    safetyRisks: List[Dict[str, Any]]
    visibleObjects: List[str]
    environmentalContext: str
    recommendedNextSteps: List[str]

class DuplicateResult(TypedDict):
    is_duplicate: bool
    confidence: int
    merge_suggestions: List[str]
    related_issues: List[str]

class RiskResult(TypedDict):
    risk_score: int
    priority: str
    reasoning: List[str]
    factors: Dict[str, Any]

class RoutingResult(TypedDict):
    department: str
    confidence: int
    alternative_departments: List[str]
    required_skills: List[str]

class PlanningResult(TypedDict):
    estimated_completion_hours: int
    resource_allocation: List[str]
    suggested_work_order: List[str]

class CommunicationResult(TypedDict):
    citizen_update: str
    officer_update: str
    admin_summary: str

class AgentStateMap(TypedDict):
    vision: str
    duplicateCheck: str
    riskAssessment: str
    departmentRouting: str
    planning: str
    communication: str

class SharedMemory(TypedDict):
    # Inputs
    issue_id: str
    report_method: str
    title: str
    description: str
    category: str
    location: Optional[Dict[str, Any]]
    image_base64: Optional[str]
    
    # State tracking
    current_agent: str
    agent_states: AgentStateMap
    status: str # "running", "completed", "failed"
    errors: Annotated[List[str], append_list]
    logs: Annotated[List[AgentLog], append_list] 
    timeline: Annotated[List[TimelineEvent], append_list]
    
    # Agent Outputs
    vision_result: Optional[VisionResult]
    duplicate_result: Optional[DuplicateResult]
    risk_result: Optional[RiskResult]
    routing_result: Optional[RoutingResult]
    planning_result: Optional[PlanningResult]
    communication_result: Optional[CommunicationResult]