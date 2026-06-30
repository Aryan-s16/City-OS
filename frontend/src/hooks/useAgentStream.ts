import { useState, useCallback, useRef } from "react";
import { CONFIG } from "@/config";

export type AuditLog = {
  agent: string;
  action: string;
  timestamp: string;
  reasoning: string;
  confidence: number;
  output: any;
};

export type StreamEvent = {
  node: string;
  status: string;
  audit?: AuditLog;
};

export function useAgentStream() {
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = useCallback((issueId: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    
    setIsRunning(true);
    setEvents([]);
    setActiveNodes(new Set(["Coordinator"]));
    setError(null);
    
    const es = new EventSource(`${CONFIG.api.baseUrl}/agents/stream/${issueId}`);
    eventSourceRef.current = es;
    
    es.addEventListener("update", (e) => {
      try {
        const data = JSON.parse(e.data) as StreamEvent;
        setEvents((prev) => [...prev, data]);
        setActiveNodes((prev) => {
          const next = new Set(prev);
          next.add(data.node);
          return next;
        });
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    });
    
    es.addEventListener("complete", () => {
      setIsRunning(false);
      setActiveNodes(new Set());
      es.close();
    });
    
    es.addEventListener("error", (e: any) => {
      console.error("SSE Error:", e);
      if (e.data) {
          try {
              const parsed = JSON.parse(e.data);
              setError(parsed.error);
          } catch(err) {}
      }
      setIsRunning(false);
      setActiveNodes(new Set());
      es.close();
    });
    
  }, []);

  const stopStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsRunning(false);
    setActiveNodes(new Set());
  }, []);

  return { isRunning, events, activeNodes, error, startStream, stopStream };
}
