import type {
  GeoIssue,
  GeoPrediction,
  GeoCrew,
  GeoDepartment,
  CommunityReport,
  HeatPoint,
} from "../types";

/** Demo incidents scattered across San Francisco. */
export const GEO_ISSUES: GeoIssue[] = [
  { id: "i-1", title: "Drainage failure", district: "Mission", category: "water", tone: "danger", status: "Critical", time: "4m", lng: -122.4184, lat: 37.7599, confidence: 0.96, summary: "Computer vision detected a collapsed storm drain near a school zone; rising water level.", live: true, resolved: false },
  { id: "i-2", title: "Pothole cluster", district: "Market St", category: "road", tone: "warning", status: "Assessing", time: "18m", lng: -122.4084, lat: 37.7849, confidence: 0.88, summary: "Seven potholes deduplicated from 41 citizen reports along a high-traffic corridor.", live: true, resolved: false },
  { id: "i-3", title: "Signal outage", district: "SoMa", category: "signal", tone: "primary", status: "Routing", time: "32m", lng: -122.3984, lat: 37.7799, confidence: 0.91, summary: "Traffic signal dark at a four-way intersection; temporary stop controls advised.", live: true, resolved: false },
  { id: "i-4", title: "Streetlight repair", district: "Embarcadero", category: "streetlight", tone: "success", status: "Resolved", time: "1h", lng: -122.3954, lat: 37.7949, confidence: 0.99, summary: "Repair verified by two community photos; closed automatically.", live: false, resolved: true },
  { id: "i-5", title: "Overflowing bins", district: "Castro", category: "garbage", tone: "warning", status: "Scheduled", time: "44m", lng: -122.4344, lat: 37.7609, confidence: 0.82, summary: "Extra pickup suggested before the weekend.", live: true, resolved: false },
  { id: "i-6", title: "Transformer fault", district: "Nob Hill", category: "electrical", tone: "danger", status: "Critical", time: "12m", lng: -122.4134, lat: 37.7929, confidence: 0.93, summary: "Localized outage risk; isolation recommended.", live: true, resolved: false },
  { id: "i-7", title: "Cracked asphalt", district: "Hayes Valley", category: "road", tone: "primary", status: "Queued", time: "1h", lng: -122.4264, lat: 37.7769, confidence: 0.79, summary: "Surface degradation, low severity.", live: true, resolved: false },
  { id: "i-8", title: "Water main seep", district: "Marina", category: "water", tone: "warning", status: "Assessing", time: "26m", lng: -122.4364, lat: 37.8019, confidence: 0.85, summary: "Possible slow leak detected from imagery.", live: true, resolved: false },
];

export const GEO_PREDICTIONS: GeoPrediction[] = [
  { id: "p-1", title: "Flooding risk · Mission", probability: 0.78, horizonDays: 1, lng: -122.4164, lat: 37.7589, reason: "Forecast rainfall meets 3 open drainage reports in low-lying zones.", action: "Pre-dispatch Water Crew 7 within 2 hours.", impact: "Avoids ~12 downstream reports and one road closure.", tone: "danger" },
  { id: "p-2", title: "Traffic surge · Downtown", probability: 0.64, horizonDays: 3, lng: -122.4034, lat: 37.7869, reason: "Stadium event overlaps Market St works at 18:00.", action: "Shift resurfacing crew to a night window.", impact: "Cuts projected congestion by ~30%.", tone: "warning" },
];

export const GEO_CREWS: GeoCrew[] = [
  { id: "c-1", name: "Water · Crew 7", status: "En route", missionId: "m-1", route: [[-122.4264, 37.7689], [-122.4224, 37.7639], [-122.4184, 37.7599]] },
  { id: "c-2", name: "Roads · Crew 2", status: "On site", missionId: "m-2", route: [[-122.4154, 37.7889], [-122.4114, 37.7869], [-122.4084, 37.7849]] },
];

export const GEO_DEPARTMENTS: GeoDepartment[] = [
  { id: "d-water", name: "Water", tone: "info", polygon: [[-122.445, 37.752], [-122.405, 37.752], [-122.405, 37.772], [-122.445, 37.772], [-122.445, 37.752]] },
  { id: "d-roads", name: "Roads", tone: "success", polygon: [[-122.415, 37.778], [-122.392, 37.778], [-122.392, 37.798], [-122.415, 37.798], [-122.415, 37.778]] },
];

export const COMMUNITY_REPORTS: CommunityReport[] = [
  { id: "r1", title: "Broken sidewalk near 24th St", lng: -122.4144, lat: 37.7524, votes: 28, verifications: 6, status: "Verified", tone: "success", summary: "12 residents confirm an uneven slab creating a trip hazard." },
  { id: "r2", title: "Overflowing bins · Folsom", lng: -122.4044, lat: 37.7714, votes: 14, verifications: 2, status: "Needs review", tone: "warning", summary: "Two reports with photos; extra pickup suggested." },
  { id: "r3", title: "Park bench vandalism", lng: -122.4534, lat: 37.7694, votes: 9, verifications: 4, status: "Verified", tone: "success", summary: "Community-verified with 4 photos; routed to Parks." },
];

/** Combined risk surface for the heatmap layer. */
export const HEAT_POINTS: HeatPoint[] = [
  ...GEO_ISSUES.map((i) => ({ lng: i.lng, lat: i.lat, weight: i.tone === "danger" ? 1 : i.tone === "warning" ? 0.7 : 0.4 })),
  ...COMMUNITY_REPORTS.map((r) => ({ lng: r.lng, lat: r.lat, weight: 0.5 })),
  { lng: -122.42, lat: 37.765, weight: 0.9 },
  { lng: -122.41, lat: 37.788, weight: 0.6 },
  { lng: -122.438, lat: 37.79, weight: 0.5 },
];
