/**
 * @file index.ts
 * @description Centralized configuration for the frontend application.
 * Environment variables should be defined and validated here.
 */

export const CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
    timeout: 10000,
  },
  firebase: {
    // TODO: Add Firebase configuration variables here for Phase B
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  },
  features: {
    enablePredictions: process.env.NEXT_PUBLIC_ENABLE_PREDICTIONS === "true",
    enableLiveUpdates: process.env.NEXT_PUBLIC_ENABLE_LIVE_UPDATES === "true",
  },
} as const;

export type AppConfig = typeof CONFIG;
