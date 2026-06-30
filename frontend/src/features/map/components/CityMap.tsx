"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Source, Layer, type MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { PointFeature } from "supercluster";
import { Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme, cn } from "@ds";
import { useContextPanel } from "@/hooks/useContextPanel";
import {
  GEO_PREDICTIONS, GEO_CREWS, GEO_DEPARTMENTS, COMMUNITY_REPORTS, HEAT_POINTS,
} from "../data/city";
import { useLiveIssues } from "@/hooks/useLiveIssues";
import { PUNE_VIEW, PUNE_CENTER, mapStyleFor } from "../styles/styles";
import { heatFC, routesFC, departmentsFC } from "../layers/geojson";
import { useSupercluster, type AnyProps } from "../hooks/useSupercluster";
import { useCrewPositions } from "../hooks/useCrewPositions";
import {
  IssuePin, ClusterBubble, CrewBadge, CommunityPin, PredictionGlow,
} from "../markers/Markers";
import { MapControls } from "../controls/MapControls";
import { MapSearch, type MapSearchPick } from "../controls/MapSearch";
import { MapLegend } from "../controls/MapLegend";
import { LayerSwitcher } from "../controls/LayerSwitcher";
import { TimelineSlider, FRAMES } from "../controls/TimelineSlider";
import type { MapLayerId } from "../types";

type IssuePointProps = { issueId: string; tone: string };

const THINKING = [
  "Analyzing nearby infrastructure…",
  "Predicting future failures…",
  "Calculating optimal routes…",
  "Searching historical reports…",
];

// Layer paint specs kept loose to avoid friction with maplibre expression types.
const heatLayer: any = {
  id: "risk-heat",
  type: "heatmap",
  paint: {
    "heatmap-weight": ["get", "weight"],
    "heatmap-intensity": 1.1,
    "heatmap-radius": 46,
    "heatmap-opacity": 0.55,
    "heatmap-color": [
      "interpolate", ["linear"], ["heatmap-density"],
      0, "rgba(0,0,0,0)",
      0.3, "rgba(79,140,255,0.35)",
      0.6, "rgba(249,168,37,0.45)",
      1, "rgba(217,48,37,0.55)",
    ],
  },
};
const routeLineLayer: any = {
  id: "route-line", type: "line",
  layout: { "line-cap": "round", "line-join": "round" },
  paint: { "line-color": "rgb(26,115,232)", "line-width": 3, "line-dasharray": [1.5, 1.5], "line-opacity": 0.85 },
};
const deptFillLayer: any = {
  id: "dept-fill", type: "fill",
  paint: { "fill-color": "rgb(26,115,232)", "fill-opacity": 0.06 },
};
const deptLineLayer: any = {
  id: "dept-line", type: "line",
  paint: { "line-color": "rgb(26,115,232)", "line-width": 1, "line-opacity": 0.3 },
};

export interface CityMapProps {
  defaultLayers?: MapLayerId[];
  showLayerSwitcher?: boolean;
  showSearch?: boolean;
  showLegend?: boolean;
  showTimeline?: boolean;
  showControls?: boolean;
  showThinking?: boolean;
  onSelectCommunity?: (id: string) => void;
  overlay?: React.ReactNode;
  className?: string;
}

export default function CityMap({
  defaultLayers = ["incidents", "predictions"],
  showLayerSwitcher = true,
  showSearch = true,
  showLegend = true,
  showTimeline = true,
  showControls = true,
  showThinking = true,
  onSelectCommunity,
  overlay,
  className,
}: CityMapProps) {
  const { theme, toggle: toggleTheme } = useTheme();
  const { kind, id, select } = useContextPanel();
  const mapRef = useRef<MapRef>(null);
  const { issues: liveIssues } = useLiveIssues();

  const [layers, setLayers] = useState<Set<MapLayerId>>(new Set(defaultLayers));
  const [frame, setFrame] = useState(0);
  const [simulate, setSimulate] = useState(false);
  const [bounds, setBounds] = useState<[number, number, number, number]>();
  const [zoom, setZoom] = useState(PUNE_VIEW.zoom);
  const [think, setThink] = useState(0);

  useEffect(() => {
    if (!showThinking) return;
    const t = setInterval(() => setThink((i) => (i + 1) % THINKING.length), 2800);
    return () => clearInterval(t);
  }, [showThinking]);

  const toggleLayer = useCallback((l: MapLayerId) => {
    setLayers((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }, []);

  const syncViewport = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getBounds();
    setBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()]);
    setZoom(map.getZoom());
  }, []);

  // Incident points for clustering (respect incidents / critical layers).
  const incidentPoints = useMemo<PointFeature<IssuePointProps>[]>(() => {
    const showAll = layers.has("incidents");
    const showCritical = layers.has("critical");
    if (!showAll && !showCritical) return [];
    return liveIssues.filter((i) => (showAll ? true : i.tone === "danger")).map((i) => ({
      type: "Feature",
      properties: { issueId: i.id, tone: i.tone },
      geometry: { type: "Point", coordinates: [i.lng, i.lat] },
    }));
  }, [layers, liveIssues]);

  const clusterOptions = useMemo(
    () => ({
      radius: 64,
      maxZoom: 16,
      map: (props: IssuePointProps) => ({
        danger: props.tone === "danger" ? 1 : 0,
        warning: props.tone === "warning" ? 1 : 0,
      }),
      reduce: (acc: AnyProps, props: AnyProps) => {
        (acc.danger as number) += props.danger as number;
        (acc.warning as number) += props.warning as number;
      },
    }),
    []
  );

  const { clusters, supercluster } = useSupercluster<IssuePointProps>({
    points: incidentPoints,
    bounds,
    zoom,
    options: clusterOptions as any,
  });

  const crewPositions = useCrewPositions(GEO_CREWS, layers.has("crews"));

  // Fly to a selection.
  useEffect(() => {
    if (!kind || !id) return;
    let center: [number, number] | undefined;
    if (kind === "issue") {
      const i = liveIssues.find((x) => x.id === id);
      if (i) center = [i.lng, i.lat];
    } else if (kind === "prediction") {
      const p = GEO_PREDICTIONS.find((x) => x.id === id);
      if (p) center = [p.lng, p.lat];
    }
    if (center) mapRef.current?.flyTo({ center, zoom: 14.5, duration: 1200, essential: true });
  }, [kind, id]);

  const flyTo = (center: [number, number], z = 15) =>
    mapRef.current?.flyTo({ center, zoom: z, duration: 1200, essential: true });

  const onPick = (p: MapSearchPick) => {
    flyTo([p.lng, p.lat]);
    if (p.kind === "issue") select("issue", p.id);
    else if (p.kind === "prediction") select("prediction", p.id);
    else onSelectCommunity?.(p.id);
  };

  const t = frame / 4;
  const intensify = simulate ? 1.3 : 1;

  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-map border border-border", className)}>
      <Map
        ref={mapRef}
        initialViewState={PUNE_VIEW}
        mapStyle={mapStyleFor(theme)}
        onLoad={syncViewport}
        onMoveEnd={syncViewport}
        attributionControl={true}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Departments */}
        {layers.has("departments") && (
          <Source id="departments" type="geojson" data={departmentsFC(GEO_DEPARTMENTS)}>
            <Layer {...deptFillLayer} />
            <Layer {...deptLineLayer} />
          </Source>
        )}

        {/* Heatmap */}
        {layers.has("heatmap") && (
          <Source id="heat" type="geojson" data={heatFC(HEAT_POINTS)}>
            <Layer {...{ ...heatLayer, paint: { ...heatLayer.paint, "heatmap-opacity": 0.55 * intensify } }} />
          </Source>
        )}

        {/* Routes */}
        {layers.has("routes") && (
          <Source id="routes" type="geojson" data={routesFC(GEO_CREWS)}>
            <Layer {...routeLineLayer} />
          </Source>
        )}

        {/* Prediction zones */}
        {layers.has("predictions") &&
          GEO_PREDICTIONS.map((p) => (
            <Marker key={p.id} longitude={p.lng} latitude={p.lat} anchor="center">
              <PredictionGlow
                tone={p.tone}
                probability={Math.min(0.99, p.probability * (1 + t * 0.35))}
                size={(120 + p.probability * 150 * (1 + t)) * intensify}
                selected={kind === "prediction" && id === p.id}
                onClick={() => select("prediction", p.id)}
              />
            </Marker>
          ))}

        {/* Crews */}
        {layers.has("crews") &&
          GEO_CREWS.map((c) => {
            const pos = crewPositions[c.id] ?? c.route[0];
            return (
              <Marker key={c.id} longitude={pos[0]} latitude={pos[1]} anchor="center">
                <CrewBadge onClick={() => select("mission", c.missionId)} />
              </Marker>
            );
          })}

        {/* Community */}
        {layers.has("community") &&
          COMMUNITY_REPORTS.map((r) => (
            <Marker key={r.id} longitude={r.lng} latitude={r.lat} anchor="center">
              <CommunityPin votes={r.votes} onClick={() => { flyTo([r.lng, r.lat]); onSelectCommunity?.(r.id); }} />
            </Marker>
          ))}

        {/* Incidents (clustered) */}
        {clusters.map((feature) => {
          const [lng, lat] = feature.geometry.coordinates as [number, number];
          const props = feature.properties as AnyProps;
          if (props.cluster) {
            const count = props.point_count as number;
            const tone = (props.danger as number) > 0 ? "danger" : (props.warning as number) > 0 ? "warning" : "primary";
            return (
              <Marker key={`cluster-${props.cluster_id}`} longitude={lng} latitude={lat} anchor="center">
                <ClusterBubble
                  count={count}
                  tone={tone}
                  onClick={() => {
                    const z = supercluster.getClusterExpansionZoom(props.cluster_id as number);
                    flyTo([lng, lat], Math.min(z, 18));
                  }}
                />
              </Marker>
            );
          }
          const issue = liveIssues.find((i) => i.id === (props.issueId as string));
          if (!issue) return null;
          return (
            <Marker key={issue.id} longitude={lng} latitude={lat} anchor="center">
              <IssuePin
                issue={issue}
                selected={kind === "issue" && id === issue.id}
                dimmed={kind === "issue" && id !== issue.id}
                onClick={() => select("issue", issue.id)}
              />
            </Marker>
          );
        })}
      </Map>

      {/* Title + AI thinking */}
      {showThinking && (
        <div className="pointer-events-none absolute left-4 top-4 z-sticky">
          <p className="text-overline uppercase tracking-widest text-text-subtle">Digital Twin</p>
          <h1 className="mt-1 text-title">{simulate ? "Projected city" : "Predictive city"} · {FRAMES[frame]}</h1>
          <div className="mt-1 flex h-5 items-center gap-2 text-caption text-text-muted">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <AnimatePresence mode="wait">
              <motion.span key={think} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
                {THINKING[think]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <MapSearch onPick={onPick} className="absolute left-1/2 top-4 z-sticky -translate-x-1/2" />
      )}

      {/* Controls */}
      {showControls && (
        <MapControls
          theme={theme}
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onLocate={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
                (pos) => flyTo([pos.coords.longitude, pos.coords.latitude], 14),
                () => flyTo(PUNE_CENTER, 13) // fallback
              );
            } else {
              flyTo(PUNE_CENTER, 13); // fallback
            }
          }}
          onReset={() => mapRef.current?.flyTo({ center: PUNE_CENTER, zoom: PUNE_VIEW.zoom, duration: 1000 })}
          onFullscreen={() => {
            const el = mapRef.current?.getContainer().parentElement ?? undefined;
            if (document.fullscreenElement) document.exitFullscreen();
            else el?.requestFullscreen?.();
          }}
          onToggleTheme={toggleTheme}
          className="absolute right-4 top-4 z-sticky"
        />
      )}

      {/* Layer chips */}
      {showLayerSwitcher && (
        <LayerSwitcher layers={layers} onToggle={toggleLayer} className="absolute left-4 top-24 z-sticky max-w-[70%]" />
      )}

      {/* Legend */}
      {showLegend && <MapLegend className="absolute bottom-4 left-4 z-sticky" />}

      {/* Timeline */}
      {showTimeline && (
        <TimelineSlider
          frame={frame}
          onFrame={setFrame}
          simulate={simulate}
          onToggleSimulate={() => setSimulate((s) => !s)}
          className="absolute bottom-4 left-1/2 z-sticky -translate-x-1/2"
        />
      )}

      {overlay}
    </div>
  );
}
