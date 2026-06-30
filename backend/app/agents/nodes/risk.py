from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class RiskOutput(BaseModel):
    safety_risk_score: int = Field(description="Safety risk 1-10.")
    infrastructure_impact_score: int = Field(description="Infrastructure impact 1-10.")
    overall_priority: str = Field(description="Critical, High, Medium, or Low.")
    risk_rationale: str = Field(description="Explanation of the risk assessment.")

async def risk_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(RiskOutput)
    
    prompt = f"""
    Assess risk for the following issue:
    Title: {state.get('title')}
    Urgency: {state.get('urgency')}
    Cascading Effects: {state.get('cascading_effects')}
    Population Affected: {state.get('affected_population_estimate')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Risk Assessment",
        "action": "Calculated risk scores",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": result.risk_rationale,
        "confidence": 0.9,
        "output": result.model_dump()
    }
    
    return {
        "safety_risk_score": result.safety_risk_score,
        "infrastructure_impact_score": result.infrastructure_impact_score,
        "overall_priority": result.overall_priority,
        "risk_rationale": result.risk_rationale,
        "audit_log": [audit]
    }
