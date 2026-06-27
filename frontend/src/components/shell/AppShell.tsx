import { NavRail } from "./NavRail";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";
import { FloatingAI } from "./FloatingAI";

/**
 * The operating-system frame, shared by every workspace.
 * Full height: only the workspace canvas scrolls, so map-centric rooms can
 * fill the viewport while document-style rooms scroll naturally.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg text-text">
      <NavRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette />
      <FloatingAI />
    </div>
  );
}
