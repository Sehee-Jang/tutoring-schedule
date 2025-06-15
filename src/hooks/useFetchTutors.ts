import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Tutor } from "../types/tutor";

interface UseFetchTutorsOptions {
  role: string;
  organizationId?: string;
  trackId?: string;
  batchId?: string;
}

export const useFetchTutors = ({
  role,
  organizationId,
  trackId,
  batchId,
}: UseFetchTutorsOptions) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!role) return;

    let q = query(collection(db, "users"), where("role", "==", "tutor"));

    if (role === "organization_admin" && organizationId) {
      q = query(q, where("organization", "==", organizationId));
    } else if (role === "track_admin" && trackId) {
      q = query(q, where("trackId", "==", trackId));
    } else if (role === "batch_admin" && batchId) {
      q = query(q, where("batchId", "==", batchId));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Tutor, "id">),
        }));
        setTutors(data);
        setLoading(false);
      },
      (err) => {
        console.error("튜터 불러오기 실패:", err);
        setError("튜터 데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { tutors, loading, error };
};
