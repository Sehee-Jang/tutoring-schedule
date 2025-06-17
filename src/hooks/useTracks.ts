import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const useTracks = (organizationId: string) => {
  const [tracks, setTracks] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organizationId) {
      setTracks([]);
      setLoading(false);
      return;
    }

    const fetchTracks = async () => {
      const snapshot = await getDocs(
        collection(db, "organizations", organizationId, "tracks")
      );
      const trackList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "ko-KR")); // 가나다순 정렬
      setTracks(trackList);
      setLoading(false);
    };

    fetchTracks();
  }, [organizationId]);

  return { tracks, loading };
};
