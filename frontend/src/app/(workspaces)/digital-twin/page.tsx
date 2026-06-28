"use client";

import { MapCanvas } from "@/features/map";
import { AdaptiveContextPanel } from "@/components/workspace/AdaptiveContextPanel";

/**
 * Digital Twin — the signature experience, now powered by MapLibre + OSM.
 * The map is the workspace; the adaptive context panel reflects every
 * selection. 70 percent map, 30 percent context.
 */
export default function DigitalTwin() {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="grid min-h-0 flex-1 grid-cols-12 gap-6">
        <div className="col-span-12 min-h-[520px] lg:col-span-8 xl:col-span-9">
          <MapCanvas defaultLayers={["incidents", "predictions", "heatmap"]} />
        </div>
        <div className="col-span-12 min-h-[520px] lg:col-span-4 xl:col-span-3">
          <AdaptiveContextPanel className="h-full" />
        </div>
      </div>
    </div>
  );
}
