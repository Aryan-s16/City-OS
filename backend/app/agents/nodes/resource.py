from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class ResourceOutput(BaseModel):
    crew_size: int = Field(description="Number of workers required.")
    vehicles_required: List[str] = Field(description="Types of vehicles needed.")
    equipment_required: List[str] = Field(description="Specific tools needed.")

async def resource_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(ResourceOutput)
    
    prompt = f"""
    Allocate resources for this mission:
    Mission: {state.get('mission_title')}
    Skills: {state.get('required_skills')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Resource Allocation",
        "action": "Allocated resources",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Estimated based on mission parameters.",
        "confidence": 0.85,
        "output": result.model_dump()
    }
    
    return {
        "crew_size": result.crew_size,
        "vehicles_required": result.vehicles_required,
        "equipment_required": result.equipment_required,
        "audit_log": [audit]
    }
