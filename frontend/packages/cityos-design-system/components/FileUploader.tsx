"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, Camera, X, Maximize2, RotateCw, Play } from "lucide-react";
import { cn } from "../utils";
import { Modal } from "./Modal";

export interface UploadItem {
  id: string;
  name: string;
  url: string;
  kind: "image" | "video";
  progress: number;
}

let _id = 0;
const nextId = () => `f${++_id}`;

export interface FileUploaderProps {
  items: UploadItem[];
  onItemsChange: (items: UploadItem[]) => void;
  accept?: string;
  className?: string;
}

/** Drag & drop + click + camera. Simulated upload progress, preview, remove. */
export function FileUploader({
  items,
  onItemsChange,
  accept = "image/*,video/*",
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [lightbox, setLightbox] = useState<UploadItem | null>(null);

  // Simulate upload progress.
  useEffect(() => {
    if (items.every((i) => i.progress >= 100)) return;
    const t = setInterval(() => {
      onItemsChange(
        items.map((i) =>
          i.progress >= 100 ? i : { ...i, progress: Math.min(100, i.progress + 18) }
        )
      );
    }, 160);
    return () => clearInterval(t);
  }, [items, onItemsChange]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: UploadItem[] = Array.from(files).map((f) => ({
      id: nextId(),
      name: f.name,
      url: URL.createObjectURL(f),
      kind: f.type.startsWith("video") ? "video" : "image",
      progress: 0,
    }));
    onItemsChange([...items, ...next]);
  };

  const remove = (id: string) =>
    onItemsChange(items.filter((i) => i.id !== id));

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition duration-fast ease-standard",
          dragging
            ? "border-primary bg-primary-soft"
            : "border-border bg-surface-muted/50 hover:border-border-strong"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary shadow-xs">
          <UploadCloud className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <p className="mt-3 text-body font-medium text-text">
          Drag photos or video here
        </p>
        <p className="mt-1 text-caption text-text-muted">
          or click to browse · camera & gallery supported
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-caption text-text-subtle">
          <Camera className="h-3.5 w-3.5" strokeWidth={1.75} /> Up to 10 files
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          capture="environment"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {items.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          <AnimatePresence>
            {items.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-muted"
              >
                {it.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.url} alt={it.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Play className="h-6 w-6 text-text-muted" strokeWidth={1.75} />
                  </div>
                )}

                {it.progress < 100 && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-overlay/20">
                    <div
                      className="h-full bg-primary transition-all duration-fast"
                      style={{ width: `${it.progress}%` }}
                    />
                  </div>
                )}

                <div className="absolute inset-0 flex items-start justify-end gap-1 bg-overlay/0 p-1.5 opacity-0 transition duration-fast ease-standard group-hover:bg-overlay/20 group-hover:opacity-100">
                  {it.kind === "image" && (
                    <button
                      onClick={() => setLightbox(it)}
                      aria-label="View"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-surface/90 text-text shadow-sm"
                    >
                      <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  )}
                  <button
                    onClick={() => remove(it.id)}
                    aria-label="Remove"
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-surface/90 text-danger shadow-sm"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}

/** Fullscreen image preview with rotate. */
function Lightbox({
  item,
  onClose,
}: {
  item: UploadItem | null;
  onClose: () => void;
}) {
  const [rot, setRot] = useState(0);
  return (
    <Modal open={!!item} onClose={onClose} size="fullscreen" title={item?.name}>
      {item && (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.url}
            alt={item.name}
            className="max-h-[70vh] rounded-lg object-contain transition-transform duration-normal"
            style={{ transform: `rotate(${rot}deg)` }}
          />
          <button
            onClick={() => setRot((r) => r + 90)}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-caption text-text-muted hover:text-text"
          >
            <RotateCw className="h-4 w-4" strokeWidth={1.75} /> Rotate
          </button>
        </div>
      )}
    </Modal>
  );
}
