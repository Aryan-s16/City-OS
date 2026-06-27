import datetime
from app.agents.memory.schema import SharedMemory

def analyze_duplicate(state: SharedMemory) -> SharedMemory:
    now = datetime.datetime.now().isoformat()
    state["current_agent"] = "Duplicate Detection Agent"
    if "agent_states" not in state or not state["agent_states"]:
        state["agent_states"] = {}
    state["agent_states"]["duplicateCheck"] = "processing"
    
    state["logs"] = [{"agent": "Duplicate Detection Agent", "timestamp": now, "message": "Fetching recent incidents within 500m radius.", "type": "info"}]
    
    # Simulate thinking time / vector search
    category = state.get("vision_result", {}).get("category", "road") if state.get("vision_result") else state.get("category", "road")
    
    # Mock logic: if it's "road", pretend we found a possible duplicate
    is_duplicate = False
    confidence = 0
    merge_suggestions = []
    related_issues = []
    
    if category == "road":
        is_duplicate = False
        confidence = 45
        related_issues = ["issue-mock-1234"]
        state["logs"].append({
            "agent": "Duplicate Detection Agent", 
            "timestamp": now, 
            "message": "Found 1 related issue (confidence 45%). Below threshold for automatic merge.", 
            "type": "decision"
        })
    else:
        state["logs"].append({
            "agent": "Duplicate Detection Agent", 
            "timestamp": now, 
            "message": "No similar incidents found in the vicinity.", 
            "type": "decision"
        })

    state["duplicate_result"] = {
        "is_duplicate": is_duplicate,
        "confidence": confidence,
        "merge_suggestions": merge_suggestions,
        "related_issues": related_issues
    }
    
    state["agent_states"]["duplicateCheck"] = "completed"
    
    state["timeline"] = [{
        "id": f"tl-{now}-dup",
        "event": "Duplicate Check Complete",
        "description": "Cross-referenced with recent reports. No critical duplicates found." if not is_duplicate else "Identified as a duplicate.",
        "timestamp": now,
        "actor": "ai",
        "icon": "Copy"
    }]
    
    return state
