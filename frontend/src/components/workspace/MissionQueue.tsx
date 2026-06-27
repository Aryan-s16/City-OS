"use client";

import { Clock, ChevronRight } from "lucide-react";
import { MISSIONS } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";
import { useContextPanel } from "@/hooks/useContextPanel";
import { cn } from "@/lib/utils";

const priorityTone = {
  Critical: "danger",
  High: "warning",
  Medium: "primary",
  Low: "neutral",
} as const;

/** Today's missions — at most five, never a table. */
export function MissionQueue({ className }: { className?: string }) {
  const { kind, id, select } = useContextPanel();
  const today = MISSIONS.filter((m) => m.status !== "Resolved").slice(0, 5);

  return (
    <div className={cn("glass w-80 rounded-panel p-2 shadow-e2", className)}>
      <p className="px-3 pb-1 pt-2 text-caption uppercase tracking-wider text-text-subtle">
        Mission queue · Today
      </p>
      <div className="space-y-0.5">
        {today.map((m) => {
          const active = kind === "mission" && id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => select("mission", m.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-left transition duration-fast ease-standard",
                active ? "bg-primary-soft" : "hover:bg-surface-muted"
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <Badge tone={priorityTone[m.priority]} dot>
                    {m.priority}
                  </Badge>
                  <span className="flex items-center gap-1 text-caption text-text-subtle">
                    <Clock className="h-3 w-3" strokeWidth={1.75} />
                    {m.eta}
                  </span>
                </span>
                <span className="mt-1 block truncate text-body text-text">
                  {m.name}
                </span>
              </span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-text-subtle"
                strokeWidth={1.75}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
