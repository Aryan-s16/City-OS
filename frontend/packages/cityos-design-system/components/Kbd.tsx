import { cn } from "../utils";

/** Keyboard key hint, e.g. ⌘K. */
export function Kbd({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-border",
        "bg-surface px-1 text-caption font-medium text-text-subtle",
        className
      )}
    >
      {children}
    </kbd>
  );
}
