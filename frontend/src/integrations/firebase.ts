import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { CONFIG } from "@/config";

// Initialize Firebase
const app = !getApps().length ? initializeApp(CONFIG.firebase) : getApp();
const db = getFirestore(app);

// Use emulator in development if configured
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { app, db };
