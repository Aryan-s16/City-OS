"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Eye,
  ShieldAlert,
  ClipboardList,
  Route,
  TrendingUp,
  MessageSquare,
  Database,
} from "lucide-react";
import { AGENTS, type Agent } from "@/lib/mock";
import { useContextPanel } from "@/hooks/useContextPanel";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Cpu> = {
  "a-coord": Cpu,
  "a-vision": Eye,
  "a-risk": ShieldAlert,
  "a-plan": ClipboardList,
  "a-route": Route,
  "a-predict": TrendingUp,
  "a-comms": MessageSquare,
  "a-memory": Database,
};

const CONNECTIONS: [string, string][] = [
  ["a-coord", "a-vision"],
  ["a-coord", "a-risk"],
  ["a-coord", "a-plan"],
  ["a-coord", "a-route"],
  ["a-coord", "a-predict"],
  ["a-coord", "a-comms"],
  ["a-coord", "a-memory"],
  ["a-vision", "a-risk"],
  ["a-risk", "a-plan"],
  ["a-plan", "a-route"],
  ["a-risk", "a-predict"],
  ["a-memory", "a-vision"],
  ["a-predict", "a-comms"],
];

const byId = (id: string) => AGENTS.find((a) => a.id === id)!;

function Node({
  agent,
  selected,
  onSelect,
}: {
  agent: Agent;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[agent.id];
  return (
    <button
      onClick={onSelect}
      className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
      style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
    >
      <span className="relative flex h-14 w-14 items-center justify-center">
        {agent.active && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "rgb(var(--primary))" }}
            initial={{ opacity: 0.25, scale: 1 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border bg-surface shadow-e1 transition duration-fast ease-standard group-hover:shadow-e2",
            selected
              ? "border-primary text-primary"
              : agent.active
              ? "border-border-strong text-text"
              : "border-border text-text-subtle"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      </span>
      <span
        className={cn(
          "rounded-button px-2 py-0.5 text-caption font-medium transition duration-fast ease-standard",
          selected ? "bg-primary-soft text-primary" : "text-text-muted"
        )}
      >
        {agent.name}
      </span>
    </button>
  );
}

/** The AI workforce as a living network — not cards. Everything flowing. */
export function AgentNetwork() {
  const { kind, id, select } = useContextPanel();

  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden rounded-map border border-border bg-surface-muted">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent" />

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {CONNECTIONS.map(([from, to], i) => {
          const a = byId(from);
          const b = byId(to);
          const live = a.active && b.active;
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                style={{ stroke: "rgb(var(--border-strong))" }}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
              {live && (
                <motion.line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  style={{ stroke: "rgb(var(--primary))" }}
                  strokeWidth={1.5}
                  strokeDasharray="3 6"
                  vectorEffect="non-scaling-stroke"
                  initial={{ strokeDashoffset: 18 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {AGENTS.map((agent) => (
        <Node
          key={agent.id}
          agent={agent}
          selected={kind === "agent" && id === agent.id}
          onSelect={() => select("agent", agent.id)}
        />
      ))}

      <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-button px-3 py-2 shadow-e1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-success opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="text-caption font-medium">
          {AGENTS.filter((a) => a.active).length} agents working
        </span>
      </div>
    </div>
  );
}
