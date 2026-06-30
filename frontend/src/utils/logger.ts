/**
 * @file logger.ts
 * @description Centralized logging utility to replace direct console.log usage.
 * Prepares the architecture for production log aggregation (e.g., DataDog, Sentry) in later phases.
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDev) {
      console.info(`[INFO]: ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`[WARN]: ${message}`, ...args);
    }
  },
  error: (message: string, error?: any, ...args: any[]) => {
    // In Phase B, this should send to Sentry or similar error tracking service
    console.error(`[ERROR]: ${message}`, error, ...args);
  },
  agent: (agentName: string, message: string, ...args: any[]) => {
    // Specific logger for LangGraph AI agent interactions
    if (isDev) {
      console.log(`[🤖 ${agentName}]: ${message}`, ...args);
    }
  },
};
