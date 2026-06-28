import type { Feature, FeatureCollection, LineString, Point, Polygon } from "geojson";
import type { GeoCrew, GeoDepartment, HeatPoint } from "../types";

export function heatFC(points: HeatPoint[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: points.map((p) => ({
      type: "Feature",
      properties: { weight: p.weight },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
    })),
  };
}

export function routesFC(crews: GeoCrew[]): FeatureCollection<LineString> {
  return {
    type: "FeatureCollection",
    features: crews.map((c) => ({
      type: "Feature",
      properties: { id: c.id },
      geometry: { type: "LineString", coordinates: c.route },
    })),
  };
}

export function departmentsFC(depts: GeoDepartment[]): FeatureCollection<Polygon> {
  return {
    type: "FeatureCollection",
    features: depts.map(
      (d): Feature<Polygon> => ({
        type: "Feature",
        properties: { id: d.id, name: d.name },
        geometry: { type: "Polygon", coordinates: [d.polygon] },
      })
    ),
  };
}
