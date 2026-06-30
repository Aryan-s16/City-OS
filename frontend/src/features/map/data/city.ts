import type {
  GeoIssue,
  GeoPrediction,
  GeoCrew,
  GeoDepartment,
  CommunityReport,
  HeatPoint,
} from "../types";

/**
 * @file city.ts
 * @warning STATIC MOCK DATA. DO NOT USE IN PRODUCTION.
 * @todo Phase B: Replace these constants with API calls to the FastAPI backend.
 */

/** Demo incidents scattered across Pune. */
export const GEO_ISSUES: GeoIssue[] = [
  { id: "i-1", title: "Drainage failure", district: "Kothrud", category: "water", tone: "danger", status: "Critical", time: "4m", lng: 73.8114, lat: 18.5034, confidence: 0.96, summary: "Computer vision detected a collapsed storm drain near a school zone; rising water level.", live: true, resolved: false },
  { id: "i-2", title: "Pothole cluster", district: "Shivajinagar", category: "road", tone: "warning", status: "Assessing", time: "18m", lng: 73.8474, lat: 18.5314, confidence: 0.88, summary: "Seven potholes deduplicated from 41 citizen reports along a high-traffic corridor.", live: true, resolved: false },
  { id: "i-3", title: "Signal outage", district: "Deccan Gymkhana", category: "signal", tone: "primary", status: "Routing", time: "32m", lng: 73.8414, lat: 18.5174, confidence: 0.91, summary: "Traffic signal dark at a four-way intersection; temporary stop controls advised.", live: true, resolved: false },
  { id: "i-4", title: "Streetlight repair", district: "Kalyani Nagar", category: "streetlight", tone: "success", status: "Resolved", time: "1h", lng: 73.9024, lat: 18.5474, confidence: 0.99, summary: "Repair verified by two community photos; closed automatically.", live: false, resolved: true },
  { id: "i-5", title: "Overflowing bins", district: "Viman Nagar", category: "garbage", tone: "warning", status: "Scheduled", time: "44m", lng: 73.9184, lat: 18.5674, confidence: 0.82, summary: "Extra pickup suggested before the weekend.", live: true, resolved: false },
  { id: "i-6", title: "Transformer fault", district: "Baner", category: "electrical", tone: "danger", status: "Critical", time: "12m", lng: 73.7844, lat: 18.5594, confidence: 0.93, summary: "Localized outage risk; isolation recommended.", live: true, resolved: false },
  { id: "i-7", title: "Cracked asphalt", district: "Aundh", category: "road", tone: "primary", status: "Queued", time: "1h", lng: 73.8054, lat: 18.5584, confidence: 0.79, summary: "Surface degradation, low severity.", live: true, resolved: false },
  { id: "i-8", title: "Water main seep", district: "Camp", category: "water", tone: "warning", status: "Assessing", time: "26m", lng: 73.8784, lat: 18.5144, confidence: 0.85, summary: "Possible slow leak detected from imagery.", live: true, resolved: false },
];

export const GEO_PREDICTIONS: GeoPrediction[] = [
  { id: "p-1", title: "Flooding risk · Hinjewadi", probability: 0.78, horizonDays: 1, lng: 73.7384, lat: 18.5914, reason: "Forecast rainfall meets 3 open drainage reports in low-lying zones.", action: "Pre-dispatch Water Crew 7 within 2 hours.", impact: "Avoids ~12 downstream reports and one road closure.", tone: "danger" },
  { id: "p-2", title: "Traffic surge · Swargate", probability: 0.64, horizonDays: 3, lng: 73.8584, lat: 18.5014, reason: "Festival overlaps road works at 18:00.", action: "Shift resurfacing crew to a night window.", impact: "Cuts projected congestion by ~30%.", tone: "warning" },
];

export const GEO_CREWS: GeoCrew[] = [
  { id: "c-1", name: "Water · Crew 7", status: "En route", missionId: "m-1", route: [[73.8214, 18.5134], [73.8164, 18.5084], [73.8114, 18.5034]] },
  { id: "c-2", name: "Roads · Crew 2", status: "On site", missionId: "m-2", route: [[73.8554, 18.5384], [73.8514, 18.5354], [73.8474, 18.5314]] },
];

export const GEO_DEPARTMENTS: GeoDepartment[] = [
  { id: "d-water", name: "Water", tone: "info", polygon: [[73.79, 18.49], [73.83, 18.49], [73.83, 18.52], [73.79, 18.52], [73.79, 18.49]] },
  { id: "d-roads", name: "Roads", tone: "success", polygon: [[73.83, 18.52], [73.87, 18.52], [73.87, 18.55], [73.83, 18.55], [73.83, 18.52]] },
];

export const COMMUNITY_REPORTS: CommunityReport[] = [
  { id: "r1", title: "Broken sidewalk near JM Road", lng: 73.8454, lat: 18.5244, votes: 28, verifications: 6, status: "Verified", tone: "success", summary: "12 residents confirm an uneven slab creating a trip hazard." },
  { id: "r2", title: "Overflowing bins · FC Road", lng: 73.8404, lat: 18.5214, votes: 14, verifications: 2, status: "Needs review", tone: "warning", summary: "Two reports with photos; extra pickup suggested." },
  { id: "r3", title: "Park bench vandalism", lng: 73.8824, lat: 18.5364, votes: 9, verifications: 4, status: "Verified", tone: "success", summary: "Community-verified with 4 photos; routed to Parks." },
];

/** Combined risk surface for the heatmap layer. */
export const HEAT_POINTS: HeatPoint[] = [
  ...GEO_ISSUES.map((i) => ({ lng: i.lng, lat: i.lat, weight: i.tone === "danger" ? 1 : i.tone === "warning" ? 0.7 : 0.4 })),
  ...COMMUNITY_REPORTS.map((r) => ({ lng: r.lng, lat: r.lat, weight: 0.5 })),
  { lng: 73.83, lat: 18.51, weight: 0.9 },
  { lng: 73.86, lat: 18.54, weight: 0.6 },
  { lng: 73.89, lat: 18.53, weight: 0.5 },
];
