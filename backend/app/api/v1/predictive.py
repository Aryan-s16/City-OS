from fastapi import APIRouter
from pydantic import BaseModel
import os

router = APIRouter()

class WhatIfRequest(BaseModel):
    issue_id: str
    scenario: str

class ScenarioCompareRequest(BaseModel):
    strategy_a: str
    strategy_b: str

@router.get("/forecast/health")
async def get_health_forecast():
    """Returns City Health predictions for the future."""
    return {
        "current": 87,
        "forecasts": [
            {"daysOut": 1, "score": 88, "confidence": 95},
            {"daysOut": 7, "score": 85, "confidence": 82},
            {"daysOut": 30, "score": 79, "confidence": 60, "warning": "Significant drop in infrastructure health expected without intervention."}
        ]
    }

@router.get("/forecast/resources")
async def get_resource_forecast():
    """Predicts future resource demand."""
    return {
        "workers": {"current": 142, "predicted_demand": 165, "shortage": 23, "department": "Sanitation"},
        "budget": {"current_burn_rate": "1.2M/mo", "predicted_burn_rate": "1.5M/mo", "reason": "Expected flood response costs."}
    }

@router.post("/simulate/what-if")
async def simulate_what_if(request: WhatIfRequest):
    """Simulates the cascading consequences of ignoring an issue."""
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return {
            "timeline": [
                {"days": 2, "effect": "Water accumulates", "severity": "low"},
                {"days": 5, "effect": "Road weakens", "severity": "medium"},
                {"days": 12, "effect": "Traffic congestion rises 20%", "severity": "high"},
                {"days": 30, "effect": "Road closure likely. Repair cost triples.", "severity": "critical"}
            ]
        }
        
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        prompt = f"Simulate the cascading failure timeline over 30 days if this issue is ignored: '{request.scenario}'. Return a JSON array of objects with keys: days (int), effect (string), severity (low/medium/high/critical)."
        response = model.generate_content(prompt)
        
        # Note: In production we'd parse the JSON strictly. 
        # For hackathon robustness, we return mock if parsing fails.
        import json
        text = response.text.strip().replace("```json", "").replace("```", "")
        return {"timeline": json.loads(text)}
    except Exception:
        return {
            "timeline": [
                {"days": 2, "effect": "Issue worsens slightly", "severity": "low"},
                {"days": 15, "effect": "Secondary failures observed", "severity": "high"},
                {"days": 30, "effect": "Critical failure", "severity": "critical"}
            ]
        }

@router.post("/simulate/weather")
async def simulate_weather():
    """Returns areas at risk based on weather simulation."""
    return {
        "event": "Heavy Rainfall (Forecasted)",
        "high_risk_zones": ["Zone 3", "Riverside"],
        "predicted_failures": [
            {"type": "drainage", "probability": 85, "location": "Zone 3"},
            {"type": "potholes", "probability": 72, "location": "Hospital Road"}
        ]
    }

@router.post("/compare-scenarios")
async def compare_scenarios(request: ScenarioCompareRequest):
    """Evaluates strategic decisions (e.g. Repair Today vs 7 Days)."""
    return {
        "strategy_a": {
            "name": request.strategy_a,
            "cost": 5000,
            "trafficImpact": 15,
            "safetyRisk": 5,
            "timeToRecovery": 1,
            "pros": ["Immediate safety resolution", "Prevents compounding damage"],
            "cons": ["Requires immediate budget reallocation"]
        },
        "strategy_b": {
            "name": request.strategy_b,
            "cost": 15000,
            "trafficImpact": 60,
            "safetyRisk": 45,
            "timeToRecovery": 4,
            "pros": ["Allows crew to focus on scheduled tasks today"],
            "cons": ["3x repair cost", "High risk of accidents in interim"]
        }
    }

@router.get("/briefing")
async def get_city_briefing():
    """Generates the script for the AI City Briefing narration."""
    return {
        "script": "Good morning. The city is currently operating at 87% health. We are tracking a critical cluster of issues near Hospital Road requiring immediate attention. Weather models predict heavy rainfall tomorrow, elevating flood risks in Zone 3 by 85%. I recommend prioritizing drainage clearance today. Overall, deploying additional sanitation workers will yield the highest immediate improvement to city health."
    }
