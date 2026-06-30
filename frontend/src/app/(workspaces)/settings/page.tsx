"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Palette,
  Bell,
  Sparkles,
  Building2,
  Shield,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "ai", label: "AI & Automation", icon: Sparkles },
  { id: "city", label: "City", icon: Building2 },
  { id: "privacy", label: "Privacy", icon: Shield },
] as const;

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border py-5 last:border-0">
      <div>
        <p className="text-body text-text">{title}</p>
        {desc && <p className="mt-0.5 text-caption text-text-muted">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Switch({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition duration-fast ease-standard",
        on ? "bg-primary" : "bg-border-strong"
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-surface shadow-e1 transition duration-fast ease-standard",
          on ? "left-6" : "left-1"
        )}
      />
    </button>
  );
}

export default function Settings() {
  const [cat, setCat] = useState<string>("appearance");
  const { theme, setTheme } = useTheme();
  const [toggles, setToggles] = useState({
    autoDispatch: true,
    predictive: true,
    digest: false,
    critical: true,
  });
  const set = (k: keyof typeof toggles, v: boolean) =>
    setToggles((p) => ({ ...p, [k]: v }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-heading">Settings</h1>

      <div className="mt-8 grid grid-cols-12 gap-10">
        {/* Categories */}
        <nav className="col-span-12 sm:col-span-4">
          <div className="space-y-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-left transition duration-fast ease-standard",
                  cat === c.id
                    ? "bg-surface-muted text-text"
                    : "text-text-muted hover:bg-surface-muted hover:text-text"
                )}
              >
                <c.icon className="h-4 w-4" strokeWidth={1.75} />
                <span className="flex-1 text-body">{c.label}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-text-subtle transition",
                    cat === c.id && "text-text"
                  )}
                  strokeWidth={1.75}
                />
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="col-span-12 sm:col-span-8">
          {cat === "appearance" && (
            <section>
              <h2 className="text-section">Appearance</h2>
              <Row title="Theme" desc="Choose how CityOS looks.">
                <div className="flex gap-1 rounded-button border border-border p-1">
                  {(["light", "dark"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "rounded-[12px] px-4 py-1.5 text-caption font-medium capitalize transition duration-fast ease-standard",
                        theme === t
                          ? "bg-surface-muted text-text"
                          : "text-text-muted hover:text-text"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Row>
              <Row title="Reduced motion" desc="Minimize non-essential animation.">
                <Switch on={false} onChange={() => {}} />
              </Row>
            </section>
          )}

          {cat === "ai" && (
            <section>
              <h2 className="text-section">AI & Automation</h2>
              <Row
                title="Auto-dispatch low-risk missions"
                desc="Let the workforce act without approval below a risk threshold."
              >
                <Switch
                  on={toggles.autoDispatch}
                  onChange={(v) => set("autoDispatch", v)}
                />
              </Row>
              <Row
                title="Predictive insights"
                desc="Surface forecasts on the map and in the copilot."
              >
                <Switch
                  on={toggles.predictive}
                  onChange={(v) => set("predictive", v)}
                />
              </Row>
            </section>
          )}

          {cat === "notifications" && (
            <section>
              <h2 className="text-section">Notifications</h2>
              <Row title="Critical incident alerts" desc="Always on for Critical priority.">
                <Switch on={toggles.critical} onChange={(v) => set("critical", v)} />
              </Row>
              <Row title="Daily digest" desc="A morning briefing at 8:00.">
                <Switch on={toggles.digest} onChange={(v) => set("digest", v)} />
              </Row>
            </section>
          )}

          {cat === "general" && (
            <section>
              <h2 className="text-section">General</h2>
              <Row title="Operator" desc="Vian Ravi · City Administrator" />
              <Row title="Language" desc="English (United States)" />
              <Row title="Time zone" desc="Pacific Time (PT)" />
            </section>
          )}

          {cat === "city" && (
            <section>
              <h2 className="text-section">City</h2>
              <Row title="Active city" desc="Pune, MH" />
              <Row title="Districts" desc="11 districts · 4 departments" />
            </section>
          )}

          {cat === "privacy" && (
            <section>
              <h2 className="text-section">Privacy</h2>
              <Row title="Citizen data retention" desc="Reports anonymized after 90 days." />
              <Row title="Audit log" desc="Every AI decision is logged and exportable." />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
