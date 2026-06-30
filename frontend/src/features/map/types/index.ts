import type { Tone } from "@ds";

export type MapLayerId =
  | "incidents"
  | "critical"
  | "predictions"
  | "heatmap"
  | "routes"
  | "crews"
  | "departments"
  | "community"
  | "infrastructure";

export type IssueCategory =
  | "road"
  | "water"
  | "electrical"
  | "garbage"
  | "signal"
  | "streetlight";

export interface GeoIssue {
  id: string;
  title: string;
  district: string;
  category: IssueCategory;
  tone: Tone;
  status: string;
  time: string;
  lng: number;
  lat: number;
  confidence: number;
  summary: string;
  live: boolean;
  resolved: boolean;
  createdAt?: string;
  priority?: string;
  aiSummary?: string;
}

export interface GeoPrediction {
  id: string;
  title: string;
  probability: number;
  horizonDays: number;
  lng: number;
  lat: number;
  reason: string;
  action: string;
  impact: string;
  tone: Tone;
}

export interface GeoCrew {
  id: string;
  name: string;
  status: string;
  missionId: string;
  route: [number, number][]; // [lng, lat] path
}

export interface GeoDepartment {
  id: string;
  name: string;
  tone: Tone;
  polygon: [number, number][]; // ring of [lng, lat]
}

export interface CommunityReport {
  id: string;
  title: string;
  lng: number;
  lat: number;
  votes: number;
  verifications: number;
  status: string;
  tone: Tone;
  summary: string;
}

export interface HeatPoint {
  lng: number;
  lat: number;
  weight: number;
}

export interface GeoMission {
  id: string;
  name: string;
  priority: string;
  crew: string;
  progress: number;
  eta: string;
  district: string;
  status: string;
  aiSummary: string;
  issueId: string;
  createdAt: string;
}
