import { motion } from "framer-motion";
import { useGlobalAgentStream } from "@/providers/AgentStreamProvider";
import { StreamEvent } from "@/hooks/useAgentStream";
import { CheckCircle2, CircleDashed, AlertCircle } from "lucide-react";
import { AIConfidence, AIReasoning } from "@ds";
import { cn } from "@/lib/utils";

function NodeItem({ event, index }: { event: StreamEvent, index: number }) {
  const { node, status, audit } = event;
  const isComplete = status === "completed";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="relative flex gap-4 pb-6 last:pb-0"
    >
      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border group-last:hidden" />
      
      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface">
        {isComplete ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : status === "error" ? (
          <AlertCircle className="h-5 w-5 text-danger" />
        ) : (
          <CircleDashed className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-body font-medium text-text">{node}</p>
          {audit && <p className="text-caption text-text-muted text-xs tabular-nums">{new Date(audit.timestamp).toLocaleTimeString()}</p>}
        </div>
        
        {audit && (
          <div className="rounded-lg border border-border bg-surface p-3">
            <p className="text-caption text-text-subtle mb-1">Reasoning</p>
            <p className="text-caption text-text-muted">{audit.reasoning}</p>
            
            {audit.confidence > 0 && (
              <div className="mt-3">
                <AIConfidence value={audit.confidence} />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ExecutionTimeline({ issueId }: { issueId: string }) {
  const { isRunning, events, activeNodes, error, startStream, stopStream } = useGlobalAgentStream();

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-section text-text font-semibold">Live AI Execution</h3>
        {isRunning ? (
          <button 
            onClick={stopStream}
            className="text-caption text-danger hover:underline px-2 py-1 rounded"
          >
            Cancel
          </button>
        ) : (
          <button 
            onClick={() => startStream(issueId)}
            className="bg-primary text-white text-caption px-3 py-1.5 rounded-md hover:bg-primary-dark transition"
          >
            Run AI Analysis
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pb-4">
        {events.length === 0 && !isRunning && (
          <div className="text-caption text-text-muted italic border border-dashed border-border rounded-lg p-6 text-center">
            Click 'Run AI Analysis' to see agents collaborate on this issue.
          </div>
        )}
        
        {events.map((e, idx) => (
          <NodeItem key={`${e.node}-${idx}`} event={e} index={idx} />
        ))}
        
        {isRunning && Array.from(activeNodes).map(node => (
          <NodeItem key={`active-${node}`} event={{ node, status: "running" }} index={events.length} />
        ))}

        {error && (
          <div className="text-danger text-caption mt-4 bg-danger/10 p-3 rounded-md">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}
