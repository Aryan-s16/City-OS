"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Terminal, Brain, Clock } from "lucide-react";
import { AGENTS } from "@/lib/mock";
import {
  Panel,
  PanelBody,
  Badge,
  AIReasoning,
  AIConfidence,
  swap,
  cn,
} from "@ds";
import { useContextPanel } from "@/hooks/useContextPanel";

const PROMPTS: Record<string, string> = {
  "a-coord": "You orchestrate a workforce of specialist agents. Decompose each incident and delegate to the right specialists, then synthesize their findings into one decision.",
  "a-vision": "You analyze citizen-submitted imagery. Classify the issue, estimate severity, and extract any safety-critical detail.",
  "a-risk": "You assess severity and forecast downstream impact by cross-referencing weather, infrastructure proximity, and history.",
  "a-plan": "You produce an executable repair plan: resources, sequence, and an estimated completion window.",
  "a-route": "You route work orders to the correct department and crew, optimizing for travel and load.",
  "a-predict": "You model downstream failures before they happen and surface them as predictions.",
  "a-comms": "You keep citizens informed with clear, timely, empathetic status updates.",
  "a-memory": "You maintain shared context across the workforce and retrieve relevant history on demand.",
};

const LOGS: Record<string, string[]> = {
  "a-vision": [
    "Loaded image batch (3) for i-1",
    "Detected: collapsed storm drain · 0.96",
    "Flagged safety: adjacent school zone",
  ],
  "a-risk": [
    "Fetched 6h precipitation forecast",
    "Matched 3 open drainage reports in low-lying zones",
    "Severity → Critical",
  ],
  "a-plan": ["Drafting work order WO-2291", "Reserved Water Crew 7"],
};

function AgentBody({ agentId }: { agentId: string }) {
  const agent = AGENTS.find((a) => a.id === agentId);
  if (!agent) return null;
  const logs = LOGS[agent.id] ?? ["Idle — awaiting delegation"];

  return (
    <>
      <div className="px-5 pt-5">
        <p className="text-overline uppercase text-text-subtle">Agent workspace</p>
        <h2 className="mt-1 flex items-center gap-2 text-section">
          {agent.name}
          <Badge tone={agent.active ? "success" : "neutral"} dot>
            {agent.active ? "Running" : "Idle"}
          </Badge>
        </h2>
        <p className="mt-1 text-caption text-text-muted">{agent.role}</p>
      </div>

      <PanelBody>
        {agent.active ? (
          <AIConfidence value={agent.confidence} />
        ) : (
          <div className="rounded-lg border border-border bg-surface p-4 text-caption text-text-muted">
            Idle — no active task.
          </div>
        )}

        <div className="rounded-md bg-surface-muted p-3">
          <p className="flex items-center gap-1.5 text-caption text-text-muted">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
            Exec time
          </p>
          <p className="mt-1 text-section tabular-nums">
            {agent.active ? "1.8s" : "—"}
          </p>
        </div>

        <AIReasoning title="Current task">{agent.state}</AIReasoning>

        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="flex items-center gap-2 text-overline uppercase text-text-muted">
            <Brain className="h-3.5 w-3.5" strokeWidth={2} />
            System prompt
          </p>
          <p className="mt-2 text-caption leading-relaxed text-text-muted">
            {PROMPTS[agent.id]}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="flex items-center gap-2 text-overline uppercase text-text-muted">
            <Terminal className="h-3.5 w-3.5" strokeWidth={2} />
            Execution log
          </p>
          <div className="mt-3 space-y-2">
            {logs.map((l, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.15 }}
                className="flex gap-2 text-caption text-text-muted"
              >
                <span className="text-text-subtle">›</span>
                <span>{l}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </PanelBody>
    </>
  );
}

function Overview() {
  const select = useContextPanel((s) => s.select);
  return (
    <>
      <div className="px-5 pt-5">
        <p className="text-overline uppercase text-text-subtle">AI workforce</p>
        <h2 className="mt-1 text-section">Live collaboration</h2>
        <p className="mt-2 text-body text-text-muted">
          Select a node to open its workspace — prompt, reasoning, memory, and logs.
        </p>
      </div>
      <PanelBody className="space-y-1">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => select("agent", a.id)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition duration-fast ease-standard hover:bg-hover"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                a.active ? "bg-success" : "bg-text-subtle"
              )}
            />
            <span className="flex-1 text-body text-text">{a.name}</span>
            <span className="truncate text-caption text-text-muted">{a.state}</span>
          </button>
        ))}
      </PanelBody>
    </>
  );
}

export function AgentWorkspacePanel({ className }: { className?: string }) {
  const { kind, id } = useContextPanel();
  const showAgent = kind === "agent" && id;

  return (
    <Panel className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={showAgent ? id : "overview"}
          variants={swap}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex h-full flex-col"
        >
          {showAgent ? <AgentBody agentId={id} /> : <Overview />}
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}
