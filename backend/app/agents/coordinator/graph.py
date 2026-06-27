from langgraph.graph import StateGraph, END
from app.agents.memory.schema import SharedMemory
from app.agents.vision.service import analyze_vision
from app.agents.duplicate.service import analyze_duplicate
from app.agents.risk.service import analyze_risk
from app.agents.routing.service import analyze_routing
from app.agents.planning.service import analyze_planning
from app.agents.communication.service import analyze_communication

def create_coordinator_graph():
    workflow = StateGraph(SharedMemory)
    
    # Add nodes
    workflow.add_node("vision", analyze_vision)
    workflow.add_node("duplicateCheck", analyze_duplicate)
    workflow.add_node("riskAssessment", analyze_risk)
    workflow.add_node("departmentRouting", analyze_routing)
    workflow.add_node("planning", analyze_planning)
    workflow.add_node("communication", analyze_communication)
    
    # Define edges (Linear Execution Flow)
    workflow.set_entry_point("vision")
    workflow.add_edge("vision", "duplicateCheck")
    workflow.add_edge("duplicateCheck", "riskAssessment")
    workflow.add_edge("riskAssessment", "departmentRouting")
    workflow.add_edge("departmentRouting", "planning")
    workflow.add_edge("planning", "communication")
    workflow.add_edge("communication", END)
    
    # Compile
    app = workflow.compile()
    return app
