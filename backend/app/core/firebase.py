import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import settings

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        if settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        elif settings.FIREBASE_PROJECT_ID and settings.FIREBASE_PRIVATE_KEY and settings.FIREBASE_CLIENT_EMAIL:
            # Reconstruct dict from env vars
            cred_dict = {
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            cred = credentials.Certificate(cred_dict)
        else:
            print("WARNING: Firebase credentials not found. App will run in mock mode.")
            return None
            
        return firebase_admin.initialize_app(cred)

# Initialize on import
app = initialize_firebase()

def get_db():
    if not app:
        return None
    return firestore.client()

def get_auth():
    if not app:
        return None
    return auth
