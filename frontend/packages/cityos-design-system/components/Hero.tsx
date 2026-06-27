import { cn } from "../utils";

export interface HeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Visual or metric that sits beside the title (e.g. a health ring). */
  aside?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * The single hero per screen. Largest, highest priority. Everything else
 * is supporting context. Typography does the work; whitespace creates calm.
 */
export function Hero({
  eyebrow,
  title,
  description,
  aside,
  actions,
  className,
}: HeroProps) {
  return (
    <section className={cn("flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-overline uppercase tracking-widest text-text-subtle">
            {eyebrow}
          </p>
        )}
        <div className="mt-3 text-heading text-text">{title}</div>
        {description && (
          <div className="mt-3 max-w-2xl text-body-lg text-text-muted">
            {description}
          </div>
        )}
        {actions && <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </section>
  );
}
