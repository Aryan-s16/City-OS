"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Trash2, Play } from "lucide-react";
import { cn } from "../utils";
import { Textarea } from "./Textarea";

const BARS = Array.from({ length: 28 }, (_, i) => i);
const MOCK_TRANSCRIPT =
  "There's a large pothole on the corner of Market and 5th — cars keep swerving around it. It's been getting worse since the rain.";

type Phase = "idle" | "recording" | "recorded";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export interface VoiceRecorderProps {
  onTranscript?: (text: string) => void;
  className?: string;
}

/** One-click voice capture with waveform + editable speech-to-text. */
export function VoiceRecorder({ onTranscript, className }: VoiceRecorderProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (phase !== "recording") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const start = () => {
    setSeconds(0);
    setPhase("recording");
  };
  const stop = () => {
    setPhase("recorded");
    setTranscript(MOCK_TRANSCRIPT);
    onTranscript?.(MOCK_TRANSCRIPT);
  };
  const reset = () => {
    setPhase("idle");
    setSeconds(0);
    setTranscript("");
    onTranscript?.("");
  };

  return (
    <div className={cn("rounded-xl border border-border bg-surface p-4", className)}>
      <div className="flex items-center gap-4">
        {phase !== "recorded" ? (
          <button
            onClick={phase === "recording" ? stop : start}
            aria-label={phase === "recording" ? "Stop recording" : "Start recording"}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition duration-fast ease-standard active:scale-95",
              phase === "recording"
                ? "bg-danger text-white"
                : "bg-primary text-on-primary"
            )}
          >
            {phase === "recording" ? (
              <Square className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Mic className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        ) : (
          <button
            aria-label="Play"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text"
          >
            <Play className="h-5 w-5" strokeWidth={2} />
          </button>
        )}

        {/* Waveform */}
        <div className="flex h-10 flex-1 items-center gap-0.5">
          {BARS.map((i) => {
            const base = 6 + ((i * 7) % 22);
            return (
              <motion.span
                key={i}
                className={cn(
                  "w-1 rounded-full",
                  phase === "idle" ? "bg-border-strong" : "bg-primary"
                )}
                animate={
                  phase === "recording"
                    ? { height: [base, base + 14, base] }
                    : { height: phase === "recorded" ? base + 4 : base }
                }
                transition={
                  phase === "recording"
                    ? { duration: 0.7, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }
                    : { duration: 0.2 }
                }
                style={{ height: base }}
              />
            );
          })}
        </div>

        <span className="w-12 text-right text-caption tabular-nums text-text-muted">
          {fmt(seconds)}
        </span>

        {phase === "recorded" && (
          <button
            onClick={reset}
            aria-label="Delete recording"
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted transition duration-fast ease-standard hover:bg-hover hover:text-danger"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {phase === "recorded" && (
        <div className="mt-4">
          <p className="mb-1.5 text-caption text-text-muted">
            Transcript · editable
          </p>
          <Textarea
            value={transcript}
            onChange={(e) => {
              setTranscript(e.target.value);
              onTranscript?.(e.target.value);
            }}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
