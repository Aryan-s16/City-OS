/**
 * CityOS AI — demo data.
 * One source of truth so the same incidents / missions / agents appear
 * consistently across every workspace.
 */

export type Tone = "danger" | "warning" | "primary" | "success" | "info";

export interface Issue {
  id: string;
  title: string;
  district: string;
  tone: Tone;
  status: string;
  time: string;
  /** position on the abstract canvas, in % */
  x: string;
  y: string;
  confidence: number;
  summary: string;
}

export interface Mission {
  id: string;
  name: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  crew: string;
  progress: number;
  eta: string;
  district: string;
  status: "Dispatched" | "In progress" | "Planning" | "Resolved";
  aiSummary: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  state: string;
  active: boolean;
  confidence: number;
  /** layout position on the network canvas, in % */
  x: number;
  y: number;
}

export interface Prediction {
  id: string;
  title: string;
  probability: number;
  reason: string;
  action: string;
  impact: string;
  tone: Tone;
}

export const CITY_HEALTH = 87;

export const ISSUES: Issue[] = [
  {
    id: "i-1",
    title: "Drainage failure",
    district: "Mission District",
    tone: "danger",
    status: "Critical",
    time: "4m",
    x: "26%",
    y: "32%",
    confidence: 0.96,
    summary:
      "Computer vision detected a collapsed storm drain. Rising water level near a school zone — flagged for immediate dispatch.",
  },
  {
    id: "i-2",
    title: "Pothole cluster",
    district: "Market Street",
    tone: "warning",
    status: "Assessing",
    time: "18m",
    x: "62%",
    y: "44%",
    confidence: 0.88,
    summary:
      "Seven potholes deduplicated from 41 citizen reports. Moderate severity, high-traffic corridor.",
  },
  {
    id: "i-3",
    title: "Signal outage",
    district: "SoMa",
    tone: "primary",
    status: "Routing",
    time: "32m",
    x: "44%",
    y: "68%",
    confidence: 0.91,
    summary:
      "Traffic signal dark at a four-way intersection. Routed to Transport dept; temporary stop controls advised.",
  },
  {
    id: "i-4",
    title: "Streetlight repair",
    district: "Embarcadero",
    tone: "success",
    status: "Resolved",
    time: "1h",
    x: "78%",
    y: "26%",
    confidence: 0.99,
    summary:
      "Repair verified by two community photos. Closed automatically by the Comms agent.",
  },
  {
    id: "i-5",
    title: "Overflowing bins",
    district: "Castro",
    tone: "warning",
    status: "Scheduled",
    time: "44m",
    x: "20%",
    y: "60%",
    confidence: 0.82,
    summary:
      "Bins past capacity; an extra pickup is suggested before the weekend.",
  },
  {
    id: "i-6",
    title: "Transformer fault",
    district: "Nob Hill",
    tone: "danger",
    status: "Critical",
    time: "12m",
    x: "52%",
    y: "30%",
    confidence: 0.93,
    summary:
      "Localized outage risk detected; isolation of the affected segment is recommended.",
  },
  {
    id: "i-7",
    title: "Cracked asphalt",
    district: "Hayes Valley",
    tone: "primary",
    status: "Queued",
    time: "1h",
    x: "34%",
    y: "50%",
    confidence: 0.79,
    summary: "Surface degradation along the corridor; low severity, queued for batching.",
  },
  {
    id: "i-8",
    title: "Water main seep",
    district: "Marina",
    tone: "warning",
    status: "Assessing",
    time: "26m",
    x: "70%",
    y: "18%",
    confidence: 0.85,
    summary: "Possible slow leak inferred from imagery; field assessment scheduled.",
  },
];

export const MISSIONS: Mission[] = [
  {
    id: "m-1",
    name: "Mission District drainage response",
    priority: "Critical",
    crew: "Water · Crew 7",
    progress: 35,
    eta: "1h 10m",
    district: "Mission",
    status: "Dispatched",
    aiSummary:
      "Pre-dispatched ahead of forecast rain. Risk agent rates downstream flooding likely without intervention.",
  },
  {
    id: "m-2",
    name: "Market St resurfacing batch",
    priority: "High",
    crew: "Roads · Crew 2",
    progress: 60,
    eta: "3h",
    district: "Downtown",
    status: "In progress",
    aiSummary:
      "Bundled 7 potholes into one route to cut crew travel by 22%.",
  },
  {
    id: "m-3",
    name: "SoMa signal restoration",
    priority: "High",
    crew: "Transport · Crew 4",
    progress: 15,
    eta: "45m",
    district: "SoMa",
    status: "Planning",
    aiSummary:
      "Awaiting parts confirmation. Temporary traffic control deployed.",
  },
  {
    id: "m-4",
    name: "Park irrigation audit",
    priority: "Medium",
    crew: "Parks · Crew 1",
    progress: 80,
    eta: "30m",
    district: "Golden Gate",
    status: "In progress",
    aiSummary: "Routine. No anomalies detected so far.",
  },
  {
    id: "m-5",
    name: "Embarcadero lighting closeout",
    priority: "Low",
    crew: "Electrical · Crew 3",
    progress: 100,
    eta: "—",
    district: "Waterfront",
    status: "Resolved",
    aiSummary: "Verified and closed.",
  },
];

export const AGENTS: Agent[] = [
  { id: "a-coord", name: "Coordinator", role: "Orchestrates the workforce", state: "Delegating", active: true, confidence: 0.94, x: 50, y: 22 },
  { id: "a-vision", name: "Vision", role: "Image understanding", state: "Analyzing image", active: true, confidence: 0.96, x: 22, y: 44 },
  { id: "a-risk", name: "Risk", role: "Severity & forecasting", state: "Cross-referencing weather", active: true, confidence: 0.9, x: 50, y: 54 },
  { id: "a-plan", name: "Planning", role: "Repair planning", state: "Drafting work order", active: true, confidence: 0.88, x: 78, y: 44 },
  { id: "a-route", name: "Routing", role: "Department routing", state: "Idle", active: false, confidence: 0.0, x: 32, y: 74 },
  { id: "a-predict", name: "Prediction", role: "Downstream failures", state: "Modeling", active: true, confidence: 0.81, x: 68, y: 74 },
  { id: "a-comms", name: "Communication", role: "Citizen updates", state: "Idle", active: false, confidence: 0.0, x: 50, y: 88 },
  { id: "a-memory", name: "Memory", role: "Shared context", state: "Indexing", active: true, confidence: 0.99, x: 14, y: 64 },
];

export const PREDICTIONS: Prediction[] = [
  {
    id: "p-1",
    title: "Flooding risk · Mission District",
    probability: 0.78,
    reason: "Forecast rainfall meets 3 open drainage reports in low-lying zones.",
    action: "Pre-dispatch Water Crew 7 within the next 2 hours.",
    impact: "Avoids ~12 likely downstream reports and one road closure.",
    tone: "danger",
  },
  {
    id: "p-2",
    title: "Traffic surge · Downtown",
    probability: 0.64,
    reason: "Stadium event + ongoing Market St works overlap at 18:00.",
    action: "Shift resurfacing crew to night window.",
    impact: "Cuts projected congestion by ~30%.",
    tone: "warning",
  },
];

export const DEPARTMENTS = [
  { name: "Water", health: 72, open: 9, tone: "warning" as Tone },
  { name: "Roads", health: 88, open: 14, tone: "success" as Tone },
  { name: "Transport", health: 81, open: 6, tone: "success" as Tone },
  { name: "Parks", health: 95, open: 2, tone: "success" as Tone },
];
