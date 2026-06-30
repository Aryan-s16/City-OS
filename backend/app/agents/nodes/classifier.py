from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class ClassificationOutput(BaseModel):
    category: str = Field(description="One of: road, streetlight, garbage, water, traffic, vegetation, sewage, property, other")
    sub_category: str = Field(description="A more specific classification (e.g. pothole, broken pipe).")
    urgency: str = Field(description="High, Medium, or Low based on immediate danger.")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")

async def classifier_node(state: GraphState) -> Dict[str, Any]:
    llm = get_llm()
    structured_llm = llm.with_structured_output(ClassificationOutput)
    
    prompt = f"""
    Classify the following civic issue:
    Title: {state.get('title')}
    Description: {state.get('description')}
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Issue Classifier",
        "action": "Classified issue",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": f"Analyzed title and description. Mapped to {result.category}.",
        "confidence": result.confidence,
        "output": result.model_dump()
    }
    
    return {
        "category": result.category,
        "sub_category": result.sub_category,
        "urgency": result.urgency,
        "classification_confidence": result.confidence,
        "audit_log": [audit]
    }
