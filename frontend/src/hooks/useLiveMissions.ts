import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/integrations/firebase";
import { logger } from "@/utils/logger";
import { GeoMission } from "@/features/map/types";

export function useLiveMissions() {
  const [missions, setMissions] = useState<GeoMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    logger.info("Initializing live Firestore listener for 'missions' collection...");
    
    const q = query(
      collection(db, "missions"), 
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id || doc.id,
            name: data.title || "Untitled Mission",
            priority: data.priority || "Medium",
            crew: data.crew_name || "Unassigned",
            progress: data.progress || 0,
            eta: data.eta || "TBD",
            district: data.district || "Unknown",
            status: data.state || "Draft",
            aiSummary: data.aiSummary || data.description || "",
            issueId: data.issue_id,
            createdAt: data.createdAt
          } as GeoMission;
        });
        
        setMissions(liveData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        logger.error("Firestore listener error on 'missions':", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      logger.info("Cleaning up live Firestore listener for 'missions'...");
      unsubscribe();
    };
  }, []);

  return { missions, loading, error };
}
