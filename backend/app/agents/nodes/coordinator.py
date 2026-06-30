from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class CoordinatorOutput(BaseModel):
    is_valid: bool = Field(description="Whether the reported issue seems valid and not spam.")
    requires_vision: bool = Field(description="Whether vision analysis is needed (true if images are provided and valid is true).")

async def coordinator_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(CoordinatorOutput)
    
    prompt = f"""
    Analyze the following civic issue report:
    Title: {state.get('title')}
    Description: {state.get('description')}
    Images Provided: {len(state.get('images', []))}
    
    Decide if this is a valid civic issue and whether vision analysis should be performed.
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Coordinator",
        "action": "Validated request",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Checked issue text and images array.",
        "confidence": 1.0,
        "output": result.model_dump()
    }
    
    return {
        "is_valid": result.is_valid,
        "requires_vision": result.requires_vision,
        "skip_processing": not result.is_valid,
        "audit_log": [audit]
    }
