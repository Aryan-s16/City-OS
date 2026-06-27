import os
import json
import base64
from app.agents.memory.schema import SharedMemory, AgentLog, TimelineEvent, VisionResult
import datetime

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

def analyze_vision(state: SharedMemory) -> SharedMemory:
    now = datetime.datetime.now().isoformat()
    state["current_agent"] = "Vision Agent"
    if "agent_states" not in state or not state["agent_states"]:
        state["agent_states"] = {}
    state["agent_states"]["vision"] = "processing"
    
    state["logs"] = [{"agent": "Vision Agent", "timestamp": now, "message": "Analyzing image and citizen report for objects, damage, and context.", "type": "info"}]
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    result = None
    
    if not gemini_key or not state.get("image_base64"):
        # Use mock
        state["logs"].append({"agent": "Vision Agent", "timestamp": now, "message": "Using fallback visual analysis model (Mock Mode).", "type": "info"})
        result = MOCK_ANALYSIS
    else:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel("gemini-2.0-flash-exp")
            
            prompt = f"""You are a civic AI system analyzing a reported city infrastructure issue.
            
Category hint from user: {state.get('category', 'unknown')}
Title: {state.get('title', 'unknown')}
Description: {state.get('description', 'unknown')}

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

IMPORTANT:
- Never hallucinate details not visible in the image
- Express uncertainty when confidence is low
- Keep descriptions factual and civic-focused
- Return ONLY valid JSON, no markdown"""

            # Handle data URLs (e.g. data:image/jpeg;base64,/9j/4AAQSk...)
            img_data = state["image_base64"]
            if img_data.startswith("data:image"):
                img_data = img_data.split(",")[1]
            image_bytes = base64.b64decode(img_data)
            
            response = model.generate_content([
                {"mime_type": "image/jpeg", "data": image_bytes},
                prompt
            ])
            
            text = response.text.strip()
            if text.startswith("```"):
                text = text.split("```")[1]
                if text.startswith("json"):
                    text = text[4:]
            
            result = json.loads(text.strip())
            state["logs"].append({"agent": "Vision Agent", "timestamp": now, "message": f"Identified category '{result['category']}' with {result['confidence']['classification']}% confidence.", "type": "decision"})
        except Exception as e:
            state["logs"].append({"agent": "Vision Agent", "timestamp": now, "message": f"Vision model failed: {str(e)}. Falling back to mock.", "type": "error"})
            result = MOCK_ANALYSIS

    state["vision_result"] = result # type: ignore
    state["agent_states"]["vision"] = "completed"
    
    state["timeline"] = [{
        "id": f"tl-{now}-vision",
        "event": "Vision Analysis Complete",
        "description": f"Objects detected: {', '.join(result['visibleObjects'][:3])}.",
        "timestamp": now,
        "actor": "ai",
        "icon": "Eye"
    }]
    
    return state
