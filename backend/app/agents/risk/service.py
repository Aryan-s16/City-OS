import datetime
from app.agents.memory.schema import SharedMemory

def analyze_risk(state: SharedMemory) -> SharedMemory:
    now = datetime.datetime.now().isoformat()
    state["current_agent"] = "Risk Assessment Agent"
    if "agent_states" not in state or not state["agent_states"]:
        state["agent_states"] = {}
    state["agent_states"]["riskAssessment"] = "processing"
    
    state["logs"] = [{"agent": "Risk Assessment Agent", "timestamp": now, "message": "Evaluating environmental and situational risk factors.", "type": "info"}]
    
    vision = state.get("vision_result")
    category = vision.get("category", "road") if vision else state.get("category", "road")
    
    # Mock Risk Assessment Logic
    risk_score = 50
    priority = "medium"
    reasoning = []
    
    if vision and vision.get("priority") == "high":
        risk_score = 85
        priority = "high"
        reasoning = ["Vision agent identified critical vehicle damage risk", "Proximity to main traffic arteries (simulated)"]
        state["logs"].append({"agent": "Risk Assessment Agent", "timestamp": now, "message": "High severity detected by vision analysis.", "type": "decision"})
    else:
        reasoning = ["Standard civic issue", "No immediate threat to public safety"]
        state["logs"].append({"agent": "Risk Assessment Agent", "timestamp": now, "message": "Calculated moderate risk based on location data.", "type": "decision"})

    state["risk_result"] = {
        "risk_score": risk_score,
        "priority": priority,
        "reasoning": reasoning,
        "factors": {
            "population_density": "high",
            "weather_impact": "moderate"
        }
    }
    
    state["agent_states"]["riskAssessment"] = "completed"
    
    state["timeline"] = [{
        "id": f"tl-{now}-risk",
        "event": "Risk Assessment Complete",
        "description": f"Risk score calculated at {risk_score}/100. Priority: {priority.upper()}.",
        "timestamp": now,
        "actor": "ai",
        "icon": "ShieldAlert"
    }]
    
    return state
