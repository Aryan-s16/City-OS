import { CityCanvas } from "@/components/workspace/CityCanvas";
import { CityHealthRing } from "@/components/workspace/CityHealthRing";
import { MissionQueue } from "@/components/workspace/MissionQueue";
import { AdaptiveContextPanel } from "@/components/workspace/AdaptiveContextPanel";
import { CITY_HEALTH } from "@/lib/mock";

/**
 * Mission Control — the command center. The city dominates; everything else
 * supports it. 70 city / 20 mission feed / 10 status.
 */
export default function MissionControl() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        {/* Primary canvas */}
        <div className="relative col-span-12 min-h-[480px] lg:col-span-8 xl:col-span-9">
          <CityCanvas className="h-full" />
          <CityHealthRing
            value={CITY_HEALTH}
            className="absolute left-4 top-4"
          />
          <MissionQueue className="absolute bottom-4 left-4" />
        </div>

        {/* Adaptive context panel */}
        <div className="col-span-12 min-h-[480px] lg:col-span-4 xl:col-span-3">
          <AdaptiveContextPanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
