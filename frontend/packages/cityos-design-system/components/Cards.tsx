"use client";

import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ImageIcon,
  ShieldCheck,
} from "lucide-react";
import { cn } from "../utils";
import type { Tone } from "./Badge";
import { Tag } from "./Tag";
import { Button } from "./Button";
import { StatusDot, ProgressBar, CircularProgress } from "./Indicators";

const cardBase =
  "rounded-lg border bg-surface transition duration-fast ease-standard";
const selectable = (selected?: boolean, interactive?: boolean) =>
  cn(
    selected
      ? "border-primary/40 bg-primary-soft/30 shadow-sm"
      : "border-border shadow-xs",
    interactive && !selected && "hover:shadow-md"
  );

/* -------------------------------------------------------------------------- */
/* Mission Card                                                                */
/* -------------------------------------------------------------------------- */
export interface MissionCardProps {
  title: string;
  priority: Tone;
  priorityLabel: string;
  department?: string;
  progress: number;
  eta: string;
  crew?: string;
  aiHint?: string;
  status: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MissionCard({
  title, priority, priorityLabel, department, progress, eta, crew, aiHint, status,
  selected, onClick, className,
}: MissionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn("group block w-full p-5 text-left", cardBase, selectable(selected, true), className)}
    >
      <div className="flex items-center gap-3">
        <StatusDot tone={priority} />
        <span className="text-caption font-medium text-text-muted">{priorityLabel}</span>
        <span className="text-caption text-text-subtle">· {status}</span>
        <span className="ml-auto flex items-center gap-1 text-caption text-text-subtle">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
          {eta}
        </span>
      </div>

      <h3 className="mt-3 text-section text-text">{title}</h3>
      {aiHint && (
        <p className="mt-1.5 flex items-start gap-1.5 text-caption text-text-muted">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2} />
          <span className="line-clamp-2">{aiHint}</span>
        </p>
      )}

      <div className="mt-4 flex items-center gap-3">
        <ProgressBar value={progress} tone={priority} className="flex-1" />
        <span className="text-caption tabular-nums text-text-muted">{progress}%</span>
      </div>

      {(crew || department) && (
        <div className="mt-3 flex items-center gap-4 text-caption text-text-muted">
          {crew && (
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" strokeWidth={1.75} />
              {crew}
            </span>
          )}
          {department && <span>{department}</span>}
        </div>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Issue Card                                                                  */
/* -------------------------------------------------------------------------- */
export interface IssueCardProps {
  image?: string;
  title: string;
  summary: string;
  severity: Tone;
  severityLabel: string;
  location: string;
  time: string;
  confidence?: number; // 0..1
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function IssueCard({
  image, title, summary, severity, severityLabel, location, time, confidence,
  selected, onClick, className,
}: IssueCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn("group block w-full overflow-hidden text-left", cardBase, selectable(selected, true), className)}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-muted">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-subtle">
            <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
          </div>
        )}
        {confidence !== undefined && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-caption font-medium text-text shadow-xs backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-primary" strokeWidth={2} />
            {Math.round(confidence * 100)}%
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-section text-text">{title}</h3>
        <p className="mt-1 line-clamp-2 text-caption text-text-muted">{summary}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-text-subtle">
          <StatusDot tone={severity} label={severityLabel} />
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
            {location}
          </span>
          <span>{time}</span>
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* AI Insight Card                                                             */
/* -------------------------------------------------------------------------- */
export interface AIInsightCardProps {
  recommendation: string;
  reason: string;
  confidence: number;
  impact: string;
  action?: { label: string; onClick?: () => void };
  className?: string;
}

export function AIInsightCard({
  recommendation, reason, confidence, impact, action, className,
}: AIInsightCardProps) {
  return (
    <div className={cn("rounded-lg border border-primary/20 bg-primary-soft p-5", className)}>
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <span className="text-overline uppercase">AI insight</span>
      </div>
      <p className="mt-3 text-section text-text">{recommendation}</p>
      <p className="mt-2 text-body leading-relaxed text-text-muted">{reason}</p>
      <div className="mt-4">
        <div className="flex items-center justify-between text-caption text-text-muted">
          <span>Confidence</span>
          <span className="tabular-nums text-text">{Math.round(confidence * 100)}%</span>
        </div>
        <ProgressBar value={confidence * 100} className="mt-1.5" />
      </div>
      <p className="mt-4 text-caption text-text-muted">
        <span className="font-medium text-text">Impact · </span>{impact}
      </p>
      {action && (
        <Button size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Prediction Card                                                            */
/* -------------------------------------------------------------------------- */
export interface PredictionCardProps {
  title: string;
  probability: number; // 0..1
  horizon: string;
  impact: string;
  tone?: Tone;
  action?: { label: string; onClick?: () => void };
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PredictionCard({
  title, probability, horizon, impact, tone = "primary", action, selected, onClick, className,
}: PredictionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn("group p-5", cardBase, selectable(selected, !!onClick), onClick && "cursor-pointer", className)}
    >
      <div className="flex items-start gap-4">
        <CircularProgress value={probability} tone={tone} size={64}>
          <span className="text-body-sm font-semibold tabular-nums">
            {Math.round(probability * 100)}%
          </span>
        </CircularProgress>
        <div className="min-w-0 flex-1">
          <h3 className="text-section text-text">{title}</h3>
          <Tag className="mt-1.5">{horizon}</Tag>
          <p className="mt-2 text-caption text-text-muted">{impact}</p>
        </div>
      </div>
      {action && (
        <Button size="sm" variant="secondary" className="mt-4 w-full" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Department Card                                                            */
/* -------------------------------------------------------------------------- */
export interface DepartmentCardProps {
  name: string;
  health: number; // 0..100
  activeMissions: number;
  completionRate: number; // 0..100
  avgResponse: string;
  trend?: number; // +/-
  tone?: Tone;
  className?: string;
}

export function DepartmentCard({
  name, health, activeMissions, completionRate, avgResponse, trend, tone = "success", className,
}: DepartmentCardProps) {
  const up = (trend ?? 0) >= 0;
  return (
    <div className={cn("p-5", cardBase, "border-border shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-section text-text">{name}</h3>
        {trend !== undefined && (
          <span className={cn("flex items-center gap-1 text-caption", up ? "text-success" : "text-danger")}>
            {up ? <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} /> : <TrendingDown className="h-3.5 w-3.5" strokeWidth={1.75} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <ProgressBar value={health} tone={tone} className="flex-1" />
        <span className="text-caption tabular-nums text-text-muted">{health}</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-caption">
        <div>
          <p className="tabular-nums text-body font-medium text-text">{activeMissions}</p>
          <p className="text-text-subtle">Active</p>
        </div>
        <div>
          <p className="tabular-nums text-body font-medium text-text">{completionRate}%</p>
          <p className="text-text-subtle">Completion</p>
        </div>
        <div>
          <p className="tabular-nums text-body font-medium text-text">{avgResponse}</p>
          <p className="text-text-subtle">Avg response</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Statistic Card                                                             */
/* -------------------------------------------------------------------------- */
export interface StatisticCardProps {
  value: string;
  label: string;
  trend?: string;
  trendTone?: "success" | "danger" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function StatisticCard({
  value, label, trend, trendTone = "success", icon: Glyph, className,
}: StatisticCardProps) {
  return (
    <div className={cn("p-5", cardBase, "border-border shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <p className="text-caption text-text-muted">{label}</p>
        {Glyph && <Glyph className="h-4 w-4 text-text-subtle" strokeWidth={1.75} />}
      </div>
      <p className="mt-2 text-heading tabular-nums text-text">{value}</p>
      {trend && (
        <p className={cn(
          "mt-1 flex items-center gap-1 text-caption",
          trendTone === "success" && "text-success",
          trendTone === "danger" && "text-danger",
          trendTone === "neutral" && "text-text-muted"
        )}>
          {trendTone === "danger" ? (
            <TrendingDown className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
          {trend}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Notification Card                                                          */
/* -------------------------------------------------------------------------- */
export interface NotificationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  tone?: Tone;
  className?: string;
}

export function NotificationCard({
  icon: Glyph, title, description, time, tone = "neutral", className,
}: NotificationCardProps) {
  const toneWrap: Record<Tone, string> = {
    neutral: "bg-surface-muted text-text-muted",
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    info: "bg-info-soft text-info",
  };
  return (
    <div className={cn("flex items-start gap-3 rounded-lg px-3 py-3 transition duration-fast ease-standard hover:bg-hover", className)}>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", toneWrap[tone])}>
        <Glyph className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body text-text">{title}</p>
        <p className="truncate text-caption text-text-muted">{description}</p>
      </div>
      <span className="shrink-0 text-caption text-text-subtle">{time}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Context Card (right panel section)                                         */
/* -------------------------------------------------------------------------- */
export function ContextCard({
  kicker, title, children, className,
}: {
  kicker?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-4", className)}>
      {kicker && <p className="text-overline uppercase text-text-subtle">{kicker}</p>}
      {title && <p className="mt-1 text-section text-text">{title}</p>}
      <div className={cn(kicker || title ? "mt-2" : "")}>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Executive Card                                                             */
/* -------------------------------------------------------------------------- */
export interface ExecutiveCardProps {
  summary: string;
  risks: string[];
  opportunities: string[];
  recommendations: string[];
  className?: string;
}

export function ExecutiveCard({
  summary, risks, opportunities, recommendations, className,
}: ExecutiveCardProps) {
  const Col = ({ title, items, tone }: { title: string; items: string[]; tone: Tone }) => (
    <div>
      <p className="flex items-center gap-2 text-overline uppercase text-text-subtle">
        <StatusDot tone={tone} />
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it} className="text-body-sm leading-relaxed text-text-muted">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8", className)}>
      <p className="flex items-center gap-2 text-overline uppercase text-primary">
        <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
        Executive brief
      </p>
      <p className="mt-4 max-w-3xl text-title font-normal text-text">{summary}</p>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <Col title="Key risks" items={risks} tone="danger" />
        <Col title="Opportunities" items={opportunities} tone="success" />
        <Col title="AI recommendations" items={recommendations} tone="primary" />
      </div>
    </div>
  );
}
