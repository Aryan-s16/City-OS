"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAgentStream, StreamEvent } from "@/hooks/useAgentStream";

type AgentStreamContextType = {
  isRunning: boolean;
  events: StreamEvent[];
  activeNodes: Set<string>;
  error: string | null;
  startStream: (issueId: string) => void;
  stopStream: () => void;
};

const AgentStreamContext = createContext<AgentStreamContextType | null>(null);

export function AgentStreamProvider({ children }: { children: ReactNode }) {
  const stream = useAgentStream();
  
  return (
    <AgentStreamContext.Provider value={stream}>
      {children}
    </AgentStreamContext.Provider>
  );
}

export function useGlobalAgentStream() {
  const ctx = useContext(AgentStreamContext);
  if (!ctx) {
    throw new Error("useGlobalAgentStream must be used within AgentStreamProvider");
  }
  return ctx;
}
