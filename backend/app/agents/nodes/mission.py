from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class MissionOutput(BaseModel):
    mission_title: str = Field(description="Actionable title for the repair/inspection mission.")
    mission_description: str = Field(description="Detailed mission brief.")
    mission_priority: str = Field(description="Critical, High, Medium, or Low.")
    estimated_duration_hours: float = Field(description="Estimated hours to complete.")
    required_skills: List[str] = Field(description="Required crew skills.")

async def mission_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(MissionOutput)
    
    prompt = f"""
    Create a mission plan for:
    Issue: {state.get('title')}
    Department: {state.get('assigned_department')}
    Priority: {state.get('overall_priority')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Mission Planning",
        "action": "Generated mission plan",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Mapped issue severity to mission requirements.",
        "confidence": 0.9,
        "output": result.model_dump()
    }
    
    return {
        "mission_title": result.mission_title,
        "mission_description": result.mission_description,
        "mission_priority": result.mission_priority,
        "estimated_duration_hours": result.estimated_duration_hours,
        "required_skills": result.required_skills,
        "audit_log": [audit]
    }
