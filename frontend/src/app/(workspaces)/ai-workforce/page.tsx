import { AgentNetwork } from "@/components/workspace/AgentNetwork";
import { AgentWorkspacePanel } from "@/components/workspace/AgentWorkspacePanel";

/**
 * AI Workforce — autonomous intelligence collaborating, live.
 * A network, not cards. Nodes pulse while running; selecting one opens its
 * workspace.
 */
export default function AIWorkforce() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4">
        <p className="text-caption uppercase tracking-widest text-text-subtle">
          AI Workforce
        </p>
        <h1 className="mt-1 text-heading">Autonomous collaboration</h1>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="col-span-12 min-h-[520px] lg:col-span-8 xl:col-span-9">
          <AgentNetwork />
        </div>
        <div className="col-span-12 min-h-[520px] lg:col-span-4 xl:col-span-3">
          <AgentWorkspacePanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
