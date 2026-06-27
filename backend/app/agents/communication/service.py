import datetime
from app.agents.memory.schema import SharedMemory

def analyze_communication(state: SharedMemory) -> SharedMemory:
    now = datetime.datetime.now().isoformat()
    state["current_agent"] = "Communication Agent"
    if "agent_states" not in state or not state["agent_states"]:
        state["agent_states"] = {}
    state["agent_states"]["communication"] = "processing"
    
    state["logs"] = [{"agent": "Communication Agent", "timestamp": now, "message": "Drafting citizen updates and internal officer briefs.", "type": "info"}]
    
    routing = state.get("routing_result", {})
    planning = state.get("planning_result", {})
    dept = routing.get("department", "the appropriate department")
    hours = planning.get("estimated_completion_hours", 48)
    
    citizen_update = f"Your report has been successfully analyzed and assigned to {dept}. A repair crew has been allocated and the issue is estimated to be resolved within {hours} hours. Thank you for making our city safer!"
    
    state["logs"].append({"agent": "Communication Agent", "timestamp": now, "message": "Drafted personalized citizen response.", "type": "decision"})

    state["communication_result"] = {
        "citizen_update": citizen_update,
        "officer_update": f"New issue assigned to {dept}. Target SLA: {hours}h.",
        "admin_summary": f"Issue auto-routed to {dept}. Est {hours}h."
    }
    
    state["agent_states"]["communication"] = "completed"
    
    state["timeline"] = [{
        "id": f"tl-{now}-comm",
        "event": "Communication Generated",
        "description": "Updates prepared for citizen, officer, and administration.",
        "timestamp": now,
        "actor": "ai",
        "icon": "MessageSquare"
    }]
    
    state["status"] = "completed"
    
    return state
