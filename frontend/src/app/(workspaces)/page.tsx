"use client";

import { MapCanvas } from "@/features/map";
import { CityHealthRing } from "@/components/workspace/CityHealthRing";
import { MissionQueue } from "@/components/workspace/MissionQueue";
import { AdaptiveContextPanel } from "@/components/workspace/AdaptiveContextPanel";
import { CITY_HEALTH } from "@/lib/mock";

/**
 * Mission Control — the command center. A live MapLibre city with a health
 * indicator and today's mission queue, plus the adaptive context panel.
 */
export default function MissionControl() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="col-span-12 min-h-[480px] lg:col-span-8 xl:col-span-9">
          <MapCanvas
            defaultLayers={["incidents"]}
            showTimeline={false}
            showLayerSwitcher={false}
            showSearch={false}
            showLegend={false}
            showThinking={false}
            overlay={
              <>
                <CityHealthRing value={CITY_HEALTH} className="absolute left-4 top-4 z-sticky" />
                <MissionQueue className="absolute bottom-4 left-4 z-sticky" />
              </>
            }
          />
        </div>
        <div className="col-span-12 min-h-[480px] lg:col-span-4 xl:col-span-3">
          <AdaptiveContextPanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
