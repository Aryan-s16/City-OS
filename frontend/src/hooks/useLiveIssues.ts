import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/integrations/firebase";
import { logger } from "@/utils/logger";
import { GeoIssue } from "@/features/map/types";

// In a real app we'd map Firestore documents directly to our TypeScript types.
// For the demo we cast them.
export function useLiveIssues() {
  const [issues, setIssues] = useState<GeoIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    logger.info("Initializing live Firestore listener for 'issues' collection...");
    
    // We order by createdAt descending to show newest issues first
    const q = query(
      collection(db, "issues"), 
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveData = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Map Firestore schema to frontend GeoIssue schema format needed for the Map
          return {
            id: data.id || doc.id,
            title: data.title,
            district: data.location?.address || "Unknown",
            category: data.category,
            tone: data.priority === "critical" ? "danger" : data.priority === "high" ? "warning" : "info",
            status: data.status,
            time: "just now", // Could be calculated from createdAt
            lng: data.location?.lng,
            lat: data.location?.lat,
            confidence: data.aiPriorityScore || 0.8,
            summary: data.aiSummary || data.description,
            live: true,
            resolved: data.status === "resolved",
          } as GeoIssue;
        });
        
        setIssues(liveData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        logger.error("Firestore listener error on 'issues':", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      logger.info("Cleaning up live Firestore listener for 'issues'...");
      unsubscribe();
    };
  }, []);

  return { issues, loading, error };
}
