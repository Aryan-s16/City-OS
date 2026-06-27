from fastapi import APIRouter
from pydantic import BaseModel
import os
import random

router = APIRouter()

class AskRequest(BaseModel):
    query: str

@router.get("/health")
async def get_city_health():
    """Returns the live City Health Score and department sub-scores."""
    return {
        "overall": 87,
        "trend": "up",
        "change": 4,
        "subScores": {
            "roads": 78,
            "water": 82,
            "electricity": 95,
            "sanitation": 88,
            "traffic": 72,
            "environment": 85,
            "safety": 90
        }
    }

@router.get("/summary")
async def get_executive_summary():
    """Generates the Morning Brief Executive Summary."""
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return {
            "summary": "Good Morning. Today there are 12 critical issues, including 3 water leaks and 2 electrical failures. Traffic congestion is expected in Zone 4. Repair teams should prioritize Hospital Road."
        }
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        prompt = "You are the CityOS AI. Generate a concise, 3-sentence 'Morning Brief' executive summary for a smart city dashboard. Mention 12 critical issues, water leaks, electrical failures, and prioritize Hospital Road."
        response = model.generate_content(prompt)
        return {"summary": response.text.strip()}
    except Exception as e:
        return {"summary": "Good Morning. Today there are 12 critical issues. Please prioritize Hospital Road."}

@router.get("/recommendations")
async def get_ai_recommendations():
    """Returns live AI recommendations for city operations."""
    return [
        {
            "id": "rec-1",
            "text": "Deploy additional sanitation workers to Zone 3.",
            "type": "deployment",
            "confidence": 92,
            "reasoning": "Post-weekend waste accumulation detected above normal thresholds.",
            "impact": "Prevents health hazard escalation."
        },
        {
            "id": "rec-2",
            "text": "Merge repair tasks on Elm Street.",
            "type": "optimization",
            "confidence": 88,
            "reasoning": "Two potholes and one streetlight failure reported within 50 meters.",
            "impact": "Saves 2.5 hours of travel time."
        },
        {
            "id": "rec-3",
            "text": "Delay low priority sidewalk repair in Zone 1.",
            "type": "delay",
            "confidence": 75,
            "reasoning": "Heavy rainfall forecast will interfere with concrete setting.",
            "impact": "Optimizes budget by preventing rework."
        }
    ]

@router.post("/ask")
async def ask_city(request: AskRequest):
    """The ⌘K Command Bar NLP query endpoint."""
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not gemini_key:
        return {
            "answer": f"I simulated processing your query: '{request.query}'. In a real environment with Gemini, I would search active missions, agent states, and department queues to give you a contextual answer."
        }
        
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        prompt = f"""You are CityOS AI, an intelligent municipal operating system.
The user is an officer querying the system via the Command Bar.
Answer their question naturally and concisely.
User Query: {request.query}

System Context:
- Overall City Health is 87/100.
- There are 12 critical issues today.
- Zone 3 is critical due to post-weekend waste accumulation.
- Hospital Road is the top priority for repairs.
- Traffic Police department is currently overloaded.

Keep your response to 2-4 sentences max."""

        response = model.generate_content(prompt)
        return {"answer": response.text.strip()}
    except Exception as e:
        return {"answer": "I'm sorry, I couldn't process that query at the moment."}
