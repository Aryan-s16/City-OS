import { cn } from "../utils";

export type Tone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

const tones: Record<Tone, { wrap: string; dot: string }> = {
  neutral: { wrap: "bg-surface-muted text-text-muted", dot: "bg-text-subtle" },
  primary: { wrap: "bg-primary-soft text-primary", dot: "bg-primary" },
  success: { wrap: "bg-success-soft text-success", dot: "bg-success" },
  warning: { wrap: "bg-warning-soft text-warning", dot: "bg-warning" },
  danger: { wrap: "bg-danger-soft text-danger", dot: "bg-danger" },
  info: { wrap: "bg-info-soft text-info", dot: "bg-info" },
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

/** Tiny, minimal status pill. Color only when meaningful. */
export function Badge({
  className,
  tone = "neutral",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const t = tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium",
        t.wrap,
        className
      )}
      {...props}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />}
      {children}
    </span>
  );
}
