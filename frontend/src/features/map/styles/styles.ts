import type { StyleSpecification } from "maplibre-gl";

/** Initial camera over Pune. */
export const PUNE_VIEW = {
  longitude: 73.8567,
  latitude: 18.5204,
  zoom: 12.2,
  pitch: 0,
  bearing: 0,
};

export const PUNE_CENTER: [number, number] = [PUNE_VIEW.longitude, PUNE_VIEW.latitude];

/**
 * Light basemap — OpenFreeMap "positron": calm, minimal, vector, OSM-based.
 * No API key required.
 */
export const LIGHT_STYLE = "https://tiles.openfreemap.org/styles/positron";

/**
 * Dark basemap — CARTO Dark Matter raster, key-free with attribution. Used
 * for the dark theme to keep the same minimal, enterprise feel.
 */
export const DARK_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [{ id: "carto-dark", type: "raster", source: "carto" }],
};

export const mapStyleFor = (theme: "light" | "dark") =>
  theme === "dark" ? DARK_STYLE : LIGHT_STYLE;
