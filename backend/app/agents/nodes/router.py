from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class RouterOutput(BaseModel):
    assigned_department: str = Field(description="Department name (e.g. Department of Transportation, Water Board).")
    confidence: float = Field(description="Routing confidence.")

async def router_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(RouterOutput)
    
    prompt = f"""
    Route this issue to the correct city department:
    Title: {state.get('title')}
    Category: {state.get('category')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Department Router",
        "action": "Assigned department",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": f"Routed based on category {state.get('category')}.",
        "confidence": result.confidence,
        "output": result.model_dump()
    }
    
    return {
        "assigned_department": result.assigned_department,
        "routing_confidence": result.confidence,
        "audit_log": [audit]
    }
