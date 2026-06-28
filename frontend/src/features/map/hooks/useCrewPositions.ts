import { useEffect, useMemo, useState } from "react";
import type { GeoCrew } from "../types";

/** Point at fraction `frac` (0..1) along a polyline of [lng, lat] points. */
function pointAlong(route: [number, number][], frac: number): [number, number] {
  if (route.length < 2) return route[0] ?? [0, 0];
  const segLengths: number[] = [];
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const dx = route[i + 1][0] - route[i][0];
    const dy = route[i + 1][1] - route[i][1];
    const len = Math.hypot(dx, dy);
    segLengths.push(len);
    total += len;
  }
  let d = Math.max(0, Math.min(1, frac)) * total;
  for (let i = 0; i < segLengths.length; i++) {
    if (d <= segLengths[i]) {
      const tt = segLengths[i] === 0 ? 0 : d / segLengths[i];
      return [
        route[i][0] + (route[i + 1][0] - route[i][0]) * tt,
        route[i][1] + (route[i + 1][1] - route[i][1]) * tt,
      ];
    }
    d -= segLengths[i];
  }
  return route[route.length - 1];
}

/**
 * Interpolates crew positions along their routes, looping over time.
 * Returns crewId -> [lng, lat]. Only animates while `active`.
 */
export function useCrewPositions(crews: GeoCrew[], active: boolean) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setT((v) => (v + 0.012) % 1), 120);
    return () => clearInterval(iv);
  }, [active]);

  return useMemo(() => {
    const positions: Record<string, [number, number]> = {};
    for (const c of crews) positions[c.id] = pointAlong(c.route, t);
    return positions;
  }, [crews, t]);
}
