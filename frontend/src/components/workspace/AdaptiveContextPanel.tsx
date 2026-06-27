"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TrendingUp, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { ISSUES, MISSIONS, PREDICTIONS, DEPARTMENTS } from "@/lib/mock";
import {
  Panel,
  PanelHeader,
  PanelBody,
  Badge,
  Button,
  AIReasoning,
  AIConfidence,
  AIRecommendation,
  swap,
  cn,
} from "@ds";
import { useContextPanel } from "@/hooks/useContextPanel";

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-surface-muted px-3 py-2.5">
      <Icon className="h-4 w-4 text-text-muted" strokeWidth={1.75} />
      <span className="text-caption text-text-muted">{label}</span>
      <span className="ml-auto text-body font-medium text-text">{value}</span>
    </div>
  );
}

function IssuePanel({ onClose }: { onClose: () => void }) {
  const id = useContextPanel((s) => s.id);
  const issue = ISSUES.find((i) => i.id === id);
  if (!issue) return null;
  return (
    <>
      <PanelHeader kicker="Issue intelligence" title={issue.title} onClose={onClose} />
      <PanelBody>
        <Badge tone={issue.tone} dot>
          {issue.status}
        </Badge>
        <AIReasoning>{issue.summary}</AIReasoning>
        <AIConfidence value={issue.confidence} />
        <Stat icon={MapPin} label="District" value={issue.district} />
        <Stat icon={Clock} label="Reported" value={`${issue.time} ago`} />
        <Button className="w-full">
          Create mission
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      </PanelBody>
    </>
  );
}

function MissionPanel({ onClose }: { onClose: () => void }) {
  const id = useContextPanel((s) => s.id);
  const m = MISSIONS.find((x) => x.id === id);
  if (!m) return null;
  return (
    <>
      <PanelHeader kicker="Mission details" title={m.name} onClose={onClose} />
      <PanelBody>
        <div className="flex items-center gap-2">
          <Badge tone="primary" dot>
            {m.status}
          </Badge>
          <Badge tone="neutral">{m.priority}</Badge>
        </div>
        <div>
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Progress</span>
            <span className="tabular-nums">{m.progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${m.progress}%` }}
              transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
            />
          </div>
        </div>
        <AIReasoning>{m.aiSummary}</AIReasoning>
        <Stat icon={Users} label="Crew" value={m.crew} />
        <Stat icon={Clock} label="ETA" value={m.eta} />
        <Stat icon={MapPin} label="District" value={m.district} />
      </PanelBody>
    </>
  );
}

function PredictionPanel({ onClose }: { onClose: () => void }) {
  const id = useContextPanel((s) => s.id);
  const p = PREDICTIONS.find((x) => x.id === id);
  if (!p) return null;
  return (
    <>
      <PanelHeader kicker="Prediction" title={p.title} onClose={onClose} />
      <PanelBody>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-caption text-text-muted">Probability</p>
          <p className="mt-1 text-title tabular-nums">
            {Math.round(p.probability * 100)}
            <span className="text-section text-text-muted">%</span>
          </p>
        </div>
        <AIReasoning>{p.reason}</AIReasoning>
        <AIRecommendation impact={p.impact}>{p.action}</AIRecommendation>
      </PanelBody>
    </>
  );
}

function OverviewPanel() {
  const select = useContextPanel((s) => s.select);
  return (
    <>
      <PanelHeader kicker="City pulse" title="Live intelligence" />
      <PanelBody>
        <p className="text-body text-text-muted">
          Select anything on the map to see its intelligence here.
        </p>

        <div>
          <p className="mb-2 text-overline uppercase text-text-subtle">
            Predictions
          </p>
          <div className="space-y-2">
            {PREDICTIONS.map((p) => (
              <button
                key={p.id}
                onClick={() => select("prediction", p.id)}
                className="flex w-full items-center gap-3 rounded-md border border-border bg-surface p-3 text-left transition duration-fast ease-standard hover:shadow-sm"
              >
                <span className={cn("h-2 w-2 rounded-full", `bg-${p.tone}`)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body text-text">
                    {p.title}
                  </span>
                  <span className="text-caption text-text-muted">
                    {Math.round(p.probability * 100)}% likely
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-text-subtle" strokeWidth={1.75} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-overline uppercase text-text-subtle">
            Departments
          </p>
          <div className="space-y-2">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-3 rounded-md bg-surface-muted px-3 py-2.5"
              >
                <span className="w-20 text-body text-text">{d.name}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
                  <div
                    className={cn("h-full rounded-full", `bg-${d.tone}`)}
                    style={{ width: `${d.health}%` }}
                  />
                </div>
                <span className="text-caption tabular-nums text-text-muted">
                  {d.health}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PanelBody>
    </>
  );
}

/** The intelligence layer. Never disappears; always reflects the selection. */
export function AdaptiveContextPanel({ className }: { className?: string }) {
  const { kind, id, clear } = useContextPanel();
  const key = `${kind ?? "overview"}-${id ?? ""}`;

  return (
    <Panel className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          variants={swap}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex h-full flex-col"
        >
          {kind === "issue" ? (
            <IssuePanel onClose={clear} />
          ) : kind === "mission" ? (
            <MissionPanel onClose={clear} />
          ) : kind === "prediction" ? (
            <PredictionPanel onClose={clear} />
          ) : (
            <OverviewPanel />
          )}
        </motion.div>
      </AnimatePresence>
    </Panel>
  );
}
