"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, MapPin, Search } from "lucide-react";
import { MISSIONS, type Mission } from "@/lib/mock";
import { MapBackground } from "@/components/workspace/MapBackground";
import {
  MissionCard,
  Timeline,
  AIReasoning,
  Badge,
  type Tone,
  type TimelineStep,
} from "@ds";

const priorityTone: Record<Mission["priority"], Tone> = {
  Critical: "danger",
  High: "warning",
  Medium: "primary",
  Low: "neutral",
};

const HISTORY: TimelineStep[] = [
  { time: "1h ago", actor: "Citizen", action: "Reported via app", done: true },
  {
    time: "58m ago",
    actor: "Vision agent",
    action: "Triaged from photos",
    done: true,
    explanation: "Classified as a collapsed storm drain at 0.96 confidence and flagged the adjacent school zone.",
  },
  {
    time: "54m ago",
    actor: "Risk agent",
    action: "Severity assessed · Critical",
    done: true,
    explanation: "Matched against 3 open drainage reports and a 6-hour rain forecast in a low-lying zone.",
  },
  { time: "40m ago", actor: "Router agent", action: "Crew dispatched", done: true },
  { time: "Pending", actor: "Water Crew 7", action: "On site", done: false },
];

function Detail({ m }: { m: Mission }) {
  return (
    <motion.div
      key={m.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2">
          <Badge tone={priorityTone[m.priority]} dot>{m.priority}</Badge>
          <Badge tone="neutral">{m.status}</Badge>
        </div>
        <h2 className="mt-3 text-title">{m.name}</h2>
        <div className="mt-2 flex flex-wrap gap-4 text-caption text-text-muted">
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" strokeWidth={1.75} />{m.district}</span>
          <span className="flex items-center gap-1.5"><Users className="h-4 w-4" strokeWidth={1.75} />{m.crew}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" strokeWidth={1.75} />ETA {m.eta}</span>
        </div>
      </div>

      <AIReasoning title="AI summary">{m.aiSummary}</AIReasoning>

      <div className="h-56 overflow-hidden rounded-lg border border-border">
        <MapBackground dim />
      </div>

      <div>
        <h3 className="mb-4 text-section">History</h3>
        <Timeline steps={HISTORY} />
      </div>
    </motion.div>
  );
}

export default function Operations() {
  const [selected, setSelected] = useState<string>(MISSIONS[0].id);
  const mission = MISSIONS.find((m) => m.id === selected)!;

  return (
    <div className="mx-auto max-w-canvas p-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-overline uppercase tracking-widest text-text-subtle">
            Operations
          </p>
          <h1 className="mt-1 text-heading">Missions</h1>
          <p className="mt-1 text-body text-text-muted">
            Directing {MISSIONS.length} missions — not processing tickets.
          </p>
        </div>
        <div className="hidden h-10 w-64 items-center gap-3 rounded-md border border-border bg-surface px-4 text-text-subtle md:flex">
          <Search className="h-4 w-4" strokeWidth={1.75} />
          <span className="text-caption">Filter missions…</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-3 lg:col-span-5">
          {MISSIONS.map((m) => (
            <MissionCard
              key={m.id}
              title={m.name}
              priority={priorityTone[m.priority]}
              priorityLabel={m.priority}
              department={m.district}
              progress={m.progress}
              eta={m.eta}
              crew={m.crew}
              aiHint={m.aiSummary}
              status={m.status}
              selected={m.id === selected}
              onClick={() => setSelected(m.id)}
            />
          ))}
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="lg:sticky lg:top-2">
            <Detail m={mission} />
          </div>
        </div>
      </div>
    </div>
  );
}
