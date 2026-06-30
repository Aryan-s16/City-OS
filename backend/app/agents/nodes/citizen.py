from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class CitizenOutput(BaseModel):
    citizen_message: str = Field(description="A friendly update message for the citizen who reported the issue.")

async def citizen_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(CitizenOutput)
    
    prompt = f"""
    Draft a message to the citizen who reported this issue:
    Title: {state.get('title')}
    Status: Routed to {state.get('assigned_department')}
    Priority: {state.get('overall_priority')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Citizen Communication",
        "action": "Drafted message",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Created empathetic update.",
        "confidence": 0.95,
        "output": result.model_dump()
    }
    
    return {
        "citizen_message": result.citizen_message,
        "audit_log": [audit]
    }
