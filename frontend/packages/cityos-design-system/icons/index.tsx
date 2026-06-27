import type { LucideIcon, LucideProps } from "lucide-react";

/** Icon sizing tokens. Lucide only, outlined, consistent stroke. */
export const iconSize = {
  default: 24,
  secondary: 20,
  compact: 16,
} as const;

export type IconSize = keyof typeof iconSize;

export interface IconProps extends Omit<LucideProps, "size"> {
  icon: LucideIcon;
  size?: IconSize;
}

/**
 * Standardized icon wrapper — enforces the size + stroke conventions so icons
 * never drift across the product.
 *
 *   <Icon icon={Search} size="compact" />
 */
export function Icon({ icon: Glyph, size = "secondary", strokeWidth = 1.75, ...props }: IconProps) {
  return <Glyph size={iconSize[size]} strokeWidth={strokeWidth} {...props} />;
}

export type { LucideIcon } from "lucide-react";
