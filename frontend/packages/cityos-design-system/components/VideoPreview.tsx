"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "../utils";

export interface VideoPreviewProps {
  src: string;
  duration?: string;
  className?: string;
}

/** Inline video with thumbnail, play/pause, and duration. */
export function VideoPreview({ src, duration, className }: VideoPreviewProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg border border-border bg-overlay", className)}>
      <video
        ref={ref}
        src={src}
        className="h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
        playsInline
      />
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute inset-0 flex items-center justify-center bg-overlay/20 transition duration-fast ease-standard hover:bg-overlay/30"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface/90 text-text shadow-md">
          {playing ? <Pause className="h-5 w-5" strokeWidth={2} /> : <Play className="h-5 w-5" strokeWidth={2} />}
        </span>
      </button>
      {duration && (
        <span className="absolute bottom-2 right-2 rounded-full bg-overlay/70 px-2 py-0.5 text-caption font-medium text-white">
          {duration}
        </span>
      )}
    </div>
  );
}
