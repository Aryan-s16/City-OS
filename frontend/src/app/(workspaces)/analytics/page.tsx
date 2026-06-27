"use client";

import { motion } from "framer-motion";
import { Sparkles, Clock, CheckCircle2, Star } from "lucide-react";
import {
  StatisticCard,
  AIInsightCard,
  ExecutiveCard,
} from "@ds";
import { duration, easing } from "@/design/tokens";

const TREND = [42, 39, 44, 38, 34, 31, 29, 27, 25, 23, 21, 19];
const DISTRICTS = [
  { name: "Mission", value: 82 },
  { name: "SoMa", value: 64 },
  { name: "Downtown", value: 91 },
  { name: "Waterfront", value: 48 },
  { name: "Sunset", value: 57 },
];

function AreaChart({ data }: { data: number[] }) {
  const w = 520;
  const h = 160;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / (max - min || 1)) * (h - 20) - 10;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.18} />
          <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path d={area} fill="url(#area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: duration.slow }} />
      <motion.path d={line} fill="none" stroke="rgb(var(--primary))" strokeWidth={2.5} strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: easing.decelerate }} />
    </svg>
  );
}

export default function Analytics() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero insight */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: duration.slow, ease: easing.decelerate }}>
        <p className="flex items-center gap-2 text-overline uppercase tracking-widest text-text-subtle">
          <Sparkles className="h-4 w-4 text-primary" strokeWidth={2} />
          This month
        </p>
        <h1 className="mt-4 text-display-xl">
          Road infrastructure improved <span className="text-primary">18%</span>
        </h1>
        <p className="mt-5 max-w-2xl text-title font-normal text-text-muted">
          Faster triage and bundled routing cut average resolution time from 42
          to 19 hours — the largest single-month gain on record.
        </p>
      </motion.div>

      {/* Supporting evidence — max 4 statistic cards */}
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatisticCard label="Avg resolution" value="19h" trend="55% faster" trendTone="success" icon={Clock} />
        <StatisticCard label="Missions closed" value="1,284" trend="12% more" trendTone="success" icon={CheckCircle2} />
        <StatisticCard label="Citizen trust" value="4.6" trend="+0.3" trendTone="success" icon={Star} />
      </div>

      {/* Charts — minimal, max two */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6 shadow-xs">
          <p className="text-section">Resolution time</p>
          <p className="text-caption text-text-muted">Hours · last 12 weeks</p>
          <div className="mt-4"><AreaChart data={TREND} /></div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 shadow-xs">
          <p className="text-section">Resolved by district</p>
          <p className="text-caption text-text-muted">This month</p>
          <div className="mt-6 space-y-3">
            {DISTRICTS.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="w-24 text-caption text-text-muted">{d.name}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
                  <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${d.value}%` }} transition={{ duration: duration.slow, ease: easing.decelerate }} />
                </div>
                <span className="w-8 text-right text-caption tabular-nums text-text-muted">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI insight */}
      <div className="mt-6">
        <AIInsightCard
          recommendation="Extend trip-bundling to Mission & SoMa."
          reason="Downtown's gain came from the Routing agent grouping nearby potholes into single crew trips — the same pattern is available elsewhere."
          confidence={0.84}
          impact="Projected 8 fewer hours of average resolution."
          action={{ label: "Apply citywide" }}
        />
      </div>

      {/* Executive brief — one per page */}
      <div className="mt-10">
        <ExecutiveCard
          summary="Road infrastructure is improving at a record pace, driven by AI-optimized routing. Drainage remains the dominant seasonal risk ahead of forecast rainfall."
          risks={[
            "Drainage backlog in low-lying Mission zones",
            "Stadium-day congestion overlaps Market St works",
          ]}
          opportunities={[
            "Trip-bundling rollout to two more districts",
            "Night-shift resurfacing during events",
          ]}
          recommendations={[
            "Pre-stage drainage crews before this week's rain",
            "Approve citywide routing optimization",
          ]}
        />
      </div>
    </div>
  );
}
