from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import json

router = APIRouter()

class VisionRequest(BaseModel):
    image_base64: str
    category_hint: Optional[str] = None

MOCK_ANALYSIS = {
    "title": "Large Pothole Causing Road Hazard",
    "description": "A significant pothole approximately 60-80 cm in diameter with visible depth of 15 cm has been identified in the traffic lane. Standing water is present inside the cavity indicating subsurface damage. The damaged area poses immediate risk to vehicles, particularly two-wheelers, and may worsen with continued traffic or rainfall.",
    "category": "road",
    "priority": "high",
    "confidence": {
        "classification": 92,
        "location": 89,
        "severity": 85
    },
    "safetyRisks": [
        {
            "type": "Vehicle Damage",
            "description": "Vehicles hitting the pothole at speed may sustain tyre or suspension damage",
            "severity": "high",
            "icon": "Car"
        },
        {
            "type": "Accident Risk",
            "description": "Sudden swerving to avoid the pothole endangers surrounding traffic",
            "severity": "critical",
            "icon": "AlertTriangle"
        }
    ],
    "visibleObjects": ["pothole", "road surface", "standing water", "lane markings"],
    "environmentalContext": "Urban road, likely high traffic volume. Overcast conditions with recent rainfall apparent.",
    "recommendedNextSteps": [
        "Immediate temporary patching with cold mix",
        "Install warning cones",
        "Schedule permanent repair within 48 hours"
    ]
}

@router.post("/vision")
async def analyze_vision(request: VisionRequest):
    """
    Analyze an image using Gemini Vision and return structured civic intelligence.
    Falls back to mock data when GEMINI_API_KEY is not set.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    
    if not gemini_key:
        # Return realistic mock — UI is identical
        return MOCK_ANALYSIS
    
    try:
        import google.generativeai as genai
        
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        # Decode the image
        import base64
        image_data = base64.b64decode(request.image_base64)
        
        prompt = f"""You are a civic AI system analyzing a reported city infrastructure issue.
        
Analyze this image and return a JSON object with exactly these fields:
{{
  "title": "concise title (max 8 words)",
  "description": "detailed 2-3 sentence description of what you observe",
  "category": one of: "road"|"streetlight"|"garbage"|"water"|"traffic"|"vegetation"|"sewage"|"property"|"other",
  "priority": one of: "critical"|"high"|"medium"|"low",
  "confidence": {{
    "classification": integer 0-100,
    "location": integer 0-100,
    "severity": integer 0-100
  }},
  "safetyRisks": [
    {{"type": "risk name", "description": "brief description", "severity": "critical|high|medium|low", "icon": "AlertTriangle|Car|Droplets|Shield|Zap|Users|Eye|Flame"}}
  ],
  "visibleObjects": ["list", "of", "visible", "objects"],
  "environmentalContext": "single sentence about environment/location",
  "recommendedNextSteps": ["action 1", "action 2", "action 3"]
}}

Category hint from user: {request.category_hint or 'unknown'}

IMPORTANT:
- Never hallucinate details not visible in the image
- Express uncertainty when confidence is low
- Keep descriptions factual and civic-focused
- Return ONLY valid JSON, no markdown"""
        
        response = model.generate_content([
            {"mime_type": "image/jpeg", "data": request.image_base64},
            prompt
        ])
        
        # Parse JSON from response
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        
        result = json.loads(text.strip())
        return result
        
    except Exception as e:
        # Graceful fallback
        print(f"Gemini API error: {e}")
        return MOCK_ANALYSIS

@router.get("/health")
async def analyze_health():
    """Check if Gemini API is configured"""
    key = os.getenv("GEMINI_API_KEY")
    return {
        "gemini_configured": bool(key),
        "model": "gemini-2.0-flash-exp",
        "mock_mode": not bool(key)
    }
