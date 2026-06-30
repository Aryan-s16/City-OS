import os
from typing import Any, Dict, List, Optional
import firebase_admin
from firebase_admin import credentials, firestore
from app.core.config import settings
from app.utils.logger import logger

class FirestoreClient:
    """Wrapper around the Google Cloud Firestore SDK via firebase-admin"""
    
    def __init__(self, project_id: Optional[str] = None):
        self.db = None
        try:
            # Check if default app is already initialized
            try:
                firebase_admin.get_app()
            except ValueError:
                # Initialize firebase app
                if os.environ.get("FIRESTORE_EMULATOR_HOST"):
                    # Use mock credentials for the emulator
                    from google.auth.credentials import AnonymousCredentials
                    cred = credentials.Certificate({
                        "type": "service_account",
                        "project_id": project_id or "demo-cityos",
                        "private_key_id": "mock",
                        "private_key": "-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----\n",
                        "client_email": "mock@mock.com",
                        "client_id": "mock",
                        "auth_uri": "mock",
                        "token_uri": "mock",
                        "auth_provider_x509_cert_url": "mock",
                        "client_x509_cert_url": "mock"
                    })
                    firebase_admin.initialize_app(cred, options={'projectId': project_id or "demo-cityos"})
                elif settings.FIREBASE_CREDENTIALS_PATH and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred)
                elif project_id:
                    firebase_admin.initialize_app(options={'projectId': project_id})
                else:
                    firebase_admin.initialize_app()
            
            self.db = firestore.client()
            logger.info("Firestore client initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {e}")
    
    async def get_document(self, collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single document from a collection."""
        if not self.db:
            return None
        doc_ref = self.db.collection(collection).document(doc_id)
        doc = doc_ref.get()
        return doc.to_dict() if doc.exists else None

    async def create_document(self, collection: str, doc_id: str, data: Dict[str, Any]) -> str:
        """Create a new document with a specific ID."""
        if not self.db:
            return doc_id
        doc_ref = self.db.collection(collection).document(doc_id)
        doc_ref.set(data)
        return doc_id

    async def update_document(self, collection: str, doc_id: str, data: Dict[str, Any]) -> bool:
        """Update an existing document."""
        if not self.db:
            return True
        doc_ref = self.db.collection(collection).document(doc_id)
        doc_ref.update(data)
        return True

    async def query_collection(
        self, 
        collection: str, 
        filters: Optional[List[tuple]] = None, 
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Query a collection with optional filters."""
        if not self.db:
            return []
        
        query = self.db.collection(collection)
        if filters:
            for field, op, val in filters:
                query = query.where(field, op, val)
        
        query = query.limit(limit)
        docs = query.stream()
        return [doc.to_dict() for doc in docs]
