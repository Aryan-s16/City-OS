"use client";

import dynamic from "next/dynamic";
import { cn } from "@ds";
import type { CityMapProps } from "./CityMap";

/**
 * MapLibre is browser-only, so the map is loaded client-side (ssr: false).
 * A shimmer placeholder holds the layout during load.
 */
const CityMap = dynamic(() => import("./CityMap"), {
  ssr: false,
  loading: () => (
    <div className={cn("h-full w-full overflow-hidden rounded-map border border-border")}>
      <div className="skeleton h-full w-full" />
    </div>
  ),
});

export function MapCanvas(props: CityMapProps) {
  return <CityMap {...props} />;
}
