import { useMemo } from "react";
import Supercluster, { type PointFeature, type ClusterFeature } from "supercluster";

export type AnyProps = Record<string, unknown>;
export type ClusterOrPoint<P extends AnyProps> =
  | ClusterFeature<AnyProps>
  | PointFeature<P>;

interface Args<P extends AnyProps> {
  points: PointFeature<P>[];
  bounds?: [number, number, number, number]; // [west, south, east, north]
  zoom: number;
  options?: Supercluster.Options<P, AnyProps>;
}

/** Memoized Supercluster clustering for the current viewport. */
export function useSupercluster<P extends AnyProps>({
  points,
  bounds,
  zoom,
  options,
}: Args<P>) {
  const supercluster = useMemo(() => {
    const sc = new Supercluster<P, AnyProps>(
      options ?? { radius: 64, maxZoom: 16 }
    );
    sc.load(points);
    return sc;
  }, [points, options]);

  const clusters = useMemo<ClusterOrPoint<P>[]>(() => {
    if (!bounds) return [];
    return supercluster.getClusters(bounds, Math.round(zoom));
  }, [supercluster, bounds, zoom]);

  return { clusters, supercluster };
}
