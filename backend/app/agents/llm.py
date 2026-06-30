import os
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def get_llm(model: str = "gemini-2.5-flash") -> ChatGoogleGenerativeAI:
    # Use standard env var for API key if set in settings
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key and hasattr(settings, "GEMINI_API_KEY"):
        api_key = settings.GEMINI_API_KEY
    
    return ChatGoogleGenerativeAI(
        model=model,
        temperature=0.0,
        google_api_key=api_key,
        max_retries=3,
    )
