from fastapi import APIRouter
from pydantic import BaseModel
import os
import json

router = APIRouter()

class CopilotRequest(BaseModel):
    query: str

@router.post("/query")
async def copilot_query(request: CopilotRequest):
    """Global AI Copilot Natural Language Search & Routing."""
    query = request.query.lower()
    
    # Mocking semantic routing for presentation
    if "open mission control" in query or "dashboard" in query:
        return {"action": "navigate", "target": "/dashboard", "message": "Opening Mission Control."}
    elif "predict" in query or "future" in query or "tomorrow" in query:
        return {"action": "navigate", "target": "/digital-twin", "message": "Opening Digital Twin and Predictive Models."}
    elif "simulate" in query or "what if" in query:
        return {"action": "navigate", "target": "/simulator", "message": "Opening the What-If Simulator."}
    elif "replay" in query or "history" in query:
        return {"action": "navigate", "target": "/replay", "message": "Initializing City Replay."}
    
    # Natural Language Answer via Gemini
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return {
            "action": "answer",
            "message": f"I processed your query '{request.query}'. (Mocked response due to missing API key. I would search the Knowledge Base.)"
        }
        
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        prompt = f"You are the CityOS AI Global Copilot. Answer the citizen or officer's query briefly and knowledgeably based on typical municipal operations. Query: {request.query}"
        response = model.generate_content(prompt)
        
        return {"action": "answer", "message": response.text.strip()}
    except Exception:
        return {"action": "answer", "message": "I am currently unable to access the Knowledge Base."}
