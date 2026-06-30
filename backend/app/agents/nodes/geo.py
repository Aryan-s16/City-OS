from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class GeoOutput(BaseModel):
    nearby_infrastructure: List[str] = Field(description="List of nearby critical infrastructure (schools, hospitals, etc).")
    affected_population_estimate: int = Field(description="Estimate of how many people are affected.")

async def geo_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(GeoOutput)
    
    prompt = f"""
    Analyze the location for this issue:
    Coordinates: {state.get('lat')}, {state.get('lng')}
    Title: {state.get('title')}
    
    Estimate nearby infrastructure and affected population.
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Geo Intelligence",
        "action": "Analyzed location",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Estimated spatial impact.",
        "confidence": 0.8,
        "output": result.model_dump()
    }
    
    return {
        "nearby_infrastructure": result.nearby_infrastructure,
        "affected_population_estimate": result.affected_population_estimate,
        "audit_log": [audit]
    }
