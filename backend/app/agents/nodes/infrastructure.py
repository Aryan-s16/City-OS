from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class InfrastructureOutput(BaseModel):
    cascading_effects: List[str] = Field(description="List of potential cascading effects (e.g. 'Road closure leads to traffic on 5th Ave').")

async def infrastructure_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(InfrastructureOutput)
    
    prompt = f"""
    Evaluate cascading effects for:
    Issue: {state.get('title')} - {state.get('description')}
    Category: {state.get('category')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Infrastructure Intelligence",
        "action": "Evaluated cascading effects",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Analyzed inter-dependencies.",
        "confidence": 0.85,
        "output": result.model_dump()
    }
    
    return {
        "cascading_effects": result.cascading_effects,
        "audit_log": [audit]
    }
