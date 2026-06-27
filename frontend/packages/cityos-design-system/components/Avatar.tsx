import { cn } from "../utils";

export type AvatarSize = "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-caption",
  lg: "h-11 w-11 text-body-sm",
};

export interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
}

/** Simple, circular, soft border, no shadow. */
export function Avatar({ name, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border",
        "bg-primary-soft font-semibold text-primary",
        sizes[size],
        className
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
