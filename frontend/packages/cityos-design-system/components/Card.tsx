import { cn } from "../utils";

export type Elevation = "flat" | "xs" | "sm" | "md" | "lg";
export type CardPadding = "none" | "sm" | "md" | "lg";

const elevations: Record<Elevation, string> = {
  flat: "border border-border",
  xs: "border border-border shadow-xs",
  sm: "border border-border shadow-sm",
  md: "border border-border shadow-md",
  lg: "border border-border shadow-lg",
};

const paddings: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: Elevation;
  padding?: CardPadding;
  interactive?: boolean;
}

/** Surface Card — the one neutral container. Differs only by elevation/padding. */
export function Card({
  className,
  elevation = "sm",
  padding = "md",
  interactive,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface",
        elevations[elevation],
        paddings[padding],
        interactive &&
          "cursor-pointer transition duration-fast ease-standard hover:shadow-md",
        className
      )}
      {...props}
    />
  );
}
