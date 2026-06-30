from langgraph.graph import StateGraph, END
from app.agents.state import GraphState
from app.agents.nodes.coordinator import coordinator_node
from app.agents.nodes.classifier import classifier_node
from app.agents.nodes.vision import vision_node
from app.agents.nodes.duplicate import duplicate_node
from app.agents.nodes.geo import geo_node
from app.agents.nodes.infrastructure import infrastructure_node
from app.agents.nodes.risk import risk_node
from app.agents.nodes.router import router_node
from app.agents.nodes.mission import mission_node
from app.agents.nodes.resource import resource_node
from app.agents.nodes.citizen import citizen_node
from app.agents.nodes.audit import audit_node
from app.agents.nodes.memory import memory_node

def build_graph() -> StateGraph:
    workflow = StateGraph(GraphState)
    
    # Add Nodes
    workflow.add_node("Coordinator", coordinator_node)
    workflow.add_node("Classifier", classifier_node)
    workflow.add_node("Vision", vision_node)
    workflow.add_node("Duplicate", duplicate_node)
    workflow.add_node("Geo", geo_node)
    workflow.add_node("Infrastructure", infrastructure_node)
    workflow.add_node("Risk", risk_node)
    workflow.add_node("Router", router_node)
    workflow.add_node("Mission", mission_node)
    workflow.add_node("Resource", resource_node)
    workflow.add_node("Citizen", citizen_node)
    workflow.add_node("Audit", audit_node)
    workflow.add_node("Memory", memory_node)
    
    # Conditional Edges from Coordinator
    def check_validity(state: GraphState):
        if state.get("skip_processing"):
            return "Audit"
        return "Classifier"
    
    workflow.set_entry_point("Coordinator")
    workflow.add_conditional_edges("Coordinator", check_validity)
    
    # Fan out after Classifier
    workflow.add_edge("Classifier", "Vision")
    workflow.add_edge("Classifier", "Duplicate")
    workflow.add_edge("Classifier", "Geo")
    workflow.add_edge("Classifier", "Infrastructure")
    
    # Fan in to Risk (Wait for parallel branches to complete before Risk)
    workflow.add_edge("Vision", "Risk")
    workflow.add_edge("Duplicate", "Risk")
    workflow.add_edge("Geo", "Risk")
    workflow.add_edge("Infrastructure", "Risk")
    
    # Sequential Pipeline
    workflow.add_edge("Risk", "Router")
    workflow.add_edge("Router", "Mission")
    workflow.add_edge("Mission", "Resource")
    workflow.add_edge("Resource", "Citizen")
    workflow.add_edge("Citizen", "Audit")
    workflow.add_edge("Audit", "Memory")
    workflow.add_edge("Memory", END)
    
    # Compile
    return workflow.compile()

# Singleton instance
cityos_graph = build_graph()
