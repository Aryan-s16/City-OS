"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Hexagon,
  Radar,
  Orbit,
  ClipboardList,
  Cpu,
  SlidersHorizontal,
  BarChart3,
  Users,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";
import { Avatar } from "@/components/ui/Avatar";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Mission Control", icon: Radar },
  { href: "/digital-twin", label: "Digital Twin", icon: Orbit },
  { href: "/operations", label: "Operations", icon: ClipboardList },
  { href: "/ai-workforce", label: "AI Workforce", icon: Cpu },
  { href: "/simulation", label: "Simulation", icon: SlidersHorizontal },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/community", label: "Community", icon: Users },
] as const;

function RailLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip label={label}>
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-button",
          "text-text-muted transition duration-fast ease-standard active:scale-[0.96]",
          "hover:bg-surface-muted hover:text-text",
          active && "bg-primary-soft text-primary hover:bg-primary-soft"
        )}
      >
        {active && (
          <span className="absolute -left-[14px] h-5 w-1 rounded-full bg-primary" />
        )}
        {children}
      </Link>
    </Tooltip>
  );
}

/** Immersive 72px rail. Icons only; labels fade in on hover. */
export function NavRail() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <nav className="flex w-[72px] shrink-0 flex-col items-center justify-between py-5">
      <div className="flex flex-col items-center gap-7">
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-button bg-primary text-on-primary shadow-e1"
        >
          <Hexagon className="h-5 w-5" strokeWidth={2} />
        </Link>

        <div className="flex flex-col items-center gap-1.5">
          {NAV.map((item) => (
            <RailLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={pathname === item.href}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </RailLink>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <Tooltip label={theme === "dark" ? "Light mode" : "Dark mode"}>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="flex h-11 w-11 items-center justify-center rounded-button text-text-muted transition duration-fast ease-standard hover:bg-surface-muted hover:text-text active:scale-[0.96]"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </Tooltip>
        <RailLink
          href="/settings"
          label="Settings"
          active={pathname === "/settings"}
        >
          <Settings className="h-5 w-5" strokeWidth={1.75} />
        </RailLink>
        <Tooltip label="Vian Ravi">
          <button className="mt-1 rounded-full transition duration-fast ease-standard active:scale-[0.96]">
            <Avatar name="Vian Ravi" />
          </button>
        </Tooltip>
      </div>
    </nav>
  );
}
