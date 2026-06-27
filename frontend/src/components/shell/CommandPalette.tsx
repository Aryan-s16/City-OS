"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Radar,
  Orbit,
  ClipboardList,
  Cpu,
  SlidersHorizontal,
  BarChart3,
  Users,
  Settings,
  FilePlus2,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";
import { Kbd, scaleIn, transitions } from "@ds";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { useContextPanel } from "@/hooks/useContextPanel";
import { ISSUES, MISSIONS, AGENTS, PREDICTIONS } from "@/lib/mock";
import { cn } from "@/lib/utils";

type Group =
  | "Actions"
  | "Navigate"
  | "Missions"
  | "Issues"
  | "Agents"
  | "Predictions"
  | "Ask CityOS";

interface Cmd {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  group: Group;
  featured?: boolean;
  run: () => void;
}

const GROUP_ORDER: Group[] = [
  "Actions",
  "Navigate",
  "Ask CityOS",
  "Missions",
  "Issues",
  "Agents",
  "Predictions",
];

export function CommandPalette() {
  const router = useRouter();
  const { open, setOpen, toggle } = useCommandPalette();
  const select = useContextPanel((s) => s.select);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, setOpen]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
    }
  }, [open]);

  const commands = useMemo<Cmd[]>(() => {
    const close = () => setOpen(false);
    const nav = (href: string) => () => {
      router.push(href);
      close();
    };
    const pick = (
      kind: "issue" | "mission" | "agent" | "prediction",
      id: string,
      href: string
    ) => () => {
      select(kind, id);
      router.push(href);
      close();
    };

    const nlAsk = (label: string, href: string): Cmd => ({
      id: `ask-${label}`,
      label,
      hint: "Ask CityOS",
      icon: Sparkles,
      group: "Ask CityOS",
      featured: true,
      run: nav(href),
    });

    return [
      {
        id: "act-report",
        label: "Report an incident",
        hint: "Open the 4-step wizard",
        icon: FilePlus2,
        group: "Actions",
        featured: true,
        run: nav("/report"),
      },
      // Navigate
      ...(
        [
          ["Mission Control", "/", Radar],
          ["Digital Twin", "/digital-twin", Orbit],
          ["Operations", "/operations", ClipboardList],
          ["AI Workforce", "/ai-workforce", Cpu],
          ["Simulation", "/simulation", SlidersHorizontal],
          ["Analytics", "/analytics", BarChart3],
          ["Community", "/community", Users],
          ["Settings", "/settings", Settings],
        ] as [string, string, LucideIcon][]
      ).map(([label, href, icon]) => ({
        id: `nav-${href}`,
        label: `Open ${label}`,
        hint: "Workspace",
        icon,
        group: "Navigate" as Group,
        featured: true,
        run: nav(href),
      })),
      // Natural-language
      nlAsk("Which districts are at risk tonight?", "/digital-twin"),
      nlAsk("Summarize today's incidents", "/analytics"),
      nlAsk("Explain today's city health", "/analytics"),
      nlAsk("Show critical missions", "/operations"),
      // Entities
      ...MISSIONS.map((m) => ({
        id: m.id,
        label: m.name,
        hint: `${m.priority} · ${m.status}`,
        icon: ClipboardList,
        group: "Missions" as Group,
        run: pick("mission", m.id, "/"),
      })),
      ...ISSUES.map((i) => ({
        id: i.id,
        label: i.title,
        hint: i.district,
        icon: AlertTriangle,
        group: "Issues" as Group,
        run: pick("issue", i.id, "/"),
      })),
      ...AGENTS.map((a) => ({
        id: a.id,
        label: a.name,
        hint: a.role,
        icon: Cpu,
        group: "Agents" as Group,
        run: pick("agent", a.id, "/ai-workforce"),
      })),
      ...PREDICTIONS.map((p) => ({
        id: p.id,
        label: p.title,
        hint: `${Math.round(p.probability * 100)}% likely`,
        icon: TrendingUp,
        group: "Predictions" as Group,
        run: pick("prediction", p.id, "/"),
      })),
    ];
  }, [router, select, setOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => c.featured);
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [query, commands]);

  const grouped = useMemo(() => {
    const map = new Map<Group, Cmd[]>();
    for (const g of GROUP_ORDER) {
      const items = results.filter((r) => r.group === g);
      if (items.length) map.set(g, items);
    }
    return map;
  }, [results]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[index]?.run();
    }
  };

  let flat = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-command flex items-start justify-center p-4 pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitions.fast}
        >
          <div className="absolute inset-0 bg-overlay/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />

          <motion.div
            role="dialog"
            aria-modal
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onKeyDown={onKey}
            className="glass relative w-full max-w-xl overflow-hidden rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-5">
              <Search className="h-5 w-5 text-text-subtle" strokeWidth={1.75} />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                placeholder="Search the city, or ask CityOS…"
                className="h-14 flex-1 bg-transparent text-body text-text outline-none placeholder:text-text-subtle"
              />
              <Kbd>Esc</Kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-body text-text">No matches</p>
                  <p className="mt-1 text-caption text-text-muted">
                    Try a mission, district, agent, or a question.
                  </p>
                </div>
              )}

              {Array.from(grouped.entries()).map(([group, items]) => (
                <div key={group} className="mb-1">
                  <p className="px-3 pb-1 pt-2 text-overline uppercase text-text-subtle">
                    {group}
                  </p>
                  {items.map((c) => {
                    flat += 1;
                    const selected = flat === index;
                    return (
                      <button
                        key={c.id}
                        onMouseMove={() => setIndex(results.indexOf(c))}
                        onClick={() => c.run()}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition duration-fast ease-standard",
                          selected ? "bg-primary-soft" : "hover:bg-hover"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md",
                            c.group === "Ask CityOS" || c.group === "Actions"
                              ? "bg-primary-soft text-primary"
                              : "bg-surface-muted text-text-muted"
                          )}
                        >
                          <c.icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("block truncate text-body", selected ? "text-primary" : "text-text")}>
                            {c.label}
                          </span>
                          <span className="block truncate text-caption text-text-muted">
                            {c.hint}
                          </span>
                        </span>
                        {selected && <ArrowRight className="h-4 w-4 text-primary" strokeWidth={1.75} />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-caption text-text-subtle">
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.75} /> to select
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} /> Powered by Gemini
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
