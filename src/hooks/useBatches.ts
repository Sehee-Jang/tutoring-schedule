import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const useBatches = (organizationId: string, trackId: string) => {
  const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 useBatches 호출:", { organizationId, trackId });
    if (!organizationId || !trackId) {
      console.log("🚫 조건 불충분으로 fetch 생략");
      setBatches([]);
      setLoading(false);
      return;
    }

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
      console.log("✅ 불러온 기수 목록:", batchList);
      setBatches(batchList);
      setLoading(false);
    };

    fetchBatches();
  }, [organizationId, trackId]);

  return { batches, loading };
};
