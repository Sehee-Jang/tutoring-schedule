import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const useBatches = (organizationId: string, trackId: string) => {
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId || !trackId) {
      console.log("🚫 조직 ID 또는 트랙 ID가 없음");
      setBatches([]);
      setLoading(false);
      return;
    }

    console.log("📥 기수 목록 가져오는 중:", organizationId, trackId);
    
    const fetchBatches = async () => {
      const snapshot = await getDocs(
        collection(
          db,
          "organizations",
          organizationId,
          "tracks",
          trackId,
          "batches"
        )
      );
      const batchList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "ko-KR"));
      setBatches(batchList);
      setLoading(false);
    };

    fetchBatches();
  }, [organizationId, trackId]);

  return { batches, loading };
};
