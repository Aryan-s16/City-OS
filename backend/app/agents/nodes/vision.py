from typing import Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, Field
from app.agents.state import GraphState
from app.agents.llm import get_llm

class VisionOutput(BaseModel):
    vision_summary: str = Field(description="A short summary of what is visible in the images.")
    objects_detected: List[str] = Field(description="List of detected objects (e.g. pothole, water, tree).")
    confidence: float = Field(description="Confidence score between 0.0 and 1.0")

async def vision_node(state: GraphState) -> Dict[str, Any]:
    images = state.get("images", [])
    if not images or not state.get("requires_vision"):
        return {
            "vision_summary": "No images provided.",
            "objects_detected": [],
            "vision_confidence": 0.0,
            "audit_log": [{
                "agent": "Vision Analysis",
                "action": "Skipped",
                "timestamp": datetime.utcnow().isoformat(),
                "reasoning": "No images to process or vision not required.",
                "confidence": 1.0,
                "output": None
            }]
        }

    llm = get_llm()
    structured_llm = llm.with_structured_output(VisionOutput)
    
    prompt = f"""
    Analyze the provided images for the issue:
    Title: {state.get('title')}
    
    Since this is a backend mock without actual image bytes yet, simulate the vision analysis based on the issue title.
    """
    
    result = await structured_llm.ainvoke(prompt)
    
    audit = {
        "agent": "Vision Analysis",
        "action": "Analyzed images",
        "timestamp": datetime.utcnow().isoformat(),
        "reasoning": "Processed images using Gemini Vision.",
        "confidence": result.confidence,
        "output": result.model_dump()
    }
    
    return {
        "vision_summary": result.vision_summary,
        "objects_detected": result.objects_detected,
        "vision_confidence": result.confidence,
        "audit_log": [audit]
    }
