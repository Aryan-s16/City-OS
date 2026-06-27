import datetime
from app.agents.memory.schema import SharedMemory

def analyze_routing(state: SharedMemory) -> SharedMemory:
    now = datetime.datetime.now().isoformat()
    state["current_agent"] = "Department Routing Agent"
    if "agent_states" not in state or not state["agent_states"]:
        state["agent_states"] = {}
    state["agent_states"]["departmentRouting"] = "processing"
    
    state["logs"] = [{"agent": "Department Routing Agent", "timestamp": now, "message": "Determining optimal department for issue resolution.", "type": "info"}]
    
    vision = state.get("vision_result")
    category = vision.get("category", "road") if vision else state.get("category", "road")
    
    department_map = {
        "road": "Public Works Department (PWD)",
        "water": "Water Supply & Sanitation",
        "streetlight": "Electricity Board",
        "garbage": "Solid Waste Management",
        "traffic": "Traffic Police",
        "vegetation": "Parks & Gardens",
        "sewage": "Drainage Department",
        "property": "Municipal Corporation",
        "other": "General Administration"
    }
    
    assigned_dept = department_map.get(category, "General Administration")
    
    state["logs"].append({"agent": "Department Routing Agent", "timestamp": now, "message": f"Mapped category '{category}' to '{assigned_dept}'.", "type": "decision"})

    state["routing_result"] = {
        "department": assigned_dept,
        "confidence": 95,
        "alternative_departments": [],
        "required_skills": ["heavy machinery", "asphalt repair"] if category == "road" else ["general maintenance"]
    }
    
    state["agent_states"]["departmentRouting"] = "completed"
    
    state["timeline"] = [{
        "id": f"tl-{now}-route",
        "event": "Department Assigned",
        "description": f"Routed to {assigned_dept}.",
        "timestamp": now,
        "actor": "ai",
        "icon": "Building2"
    }]
    
    return state
