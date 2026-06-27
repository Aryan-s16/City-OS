import datetime
from app.agents.memory.schema import SharedMemory

def analyze_planning(state: SharedMemory) -> SharedMemory:
    now = datetime.datetime.now().isoformat()
    state["current_agent"] = "Planning Agent"
    if "agent_states" not in state or not state["agent_states"]:
        state["agent_states"] = {}
    state["agent_states"]["planning"] = "processing"
    
    state["logs"] = [{"agent": "Planning Agent", "timestamp": now, "message": "Evaluating current workload and resources to schedule repair.", "type": "info"}]
    
    risk = state.get("risk_result", {})
    priority = risk.get("priority", "medium")
    
    hours = 48
    if priority == "critical":
        hours = 4
    elif priority == "high":
        hours = 24
        
    state["logs"].append({"agent": "Planning Agent", "timestamp": now, "message": f"Calculated estimated completion time: {hours} hours based on {priority} priority.", "type": "decision"})

    state["planning_result"] = {
        "estimated_completion_hours": hours,
        "resource_allocation": ["1 repair crew", "1 inspection vehicle"],
        "suggested_work_order": [
            "Site inspection and safety perimeter setup",
            "Initial damage control / temporary fix",
            "Permanent structural repair",
            "Final verification"
        ]
    }
    
    state["agent_states"]["planning"] = "completed"
    
    state["timeline"] = [{
        "id": f"tl-{now}-plan",
        "event": "Repair Planned",
        "description": f"Scheduled for completion within {hours} hours. Crew and equipment allocated.",
        "timestamp": now,
        "actor": "ai",
        "icon": "Calendar"
    }]
    
    return state
