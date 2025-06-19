import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ExtendedTutor, Tutor } from "../types/tutor";
import { getNameById } from "../utils/getOrgNameById";

interface UseFetchTutorsOptions {
  role: string;
  organizationId?: string;
  trackId?: string;
  batchIds?: string[];
}

export const useFetchTutors = ({
  role,
  organizationId,
  trackId,
  batchIds,
}: UseFetchTutorsOptions) => {
  const [tutors, setTutors] = useState<ExtendedTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isValidStudent =
      role === "student" &&
      !!organizationId &&
      !!trackId &&
      Array.isArray(batchIds) &&
      batchIds.length > 0;

      if (!role) {
        setTutors([]);
        setLoading(false);
        return;
      }

    // // role이 없거나 조건이 만족되지 않으면 tutors 초기화
    // if (!isValidStudent) {
    //   setTutors([]);
    //   setLoading(false);
    //   return;
    // }

    let q = query(collection(db, "users"), where("role", "==", "tutor"));

    if (role === "organization_admin" && organizationId) {
      q = query(q, where("organizationId", "==", organizationId));
    } else if (role === "track_admin" && trackId) {
      q = query(q, where("trackId", "==", trackId));
    } else if (role === "batch_admin" && batchIds) {
      q = query(q, where("batchIds", "array-contains", batchIds[0]));
    } else if (
      role === "student" &&
      organizationId &&
      trackId &&
      batchIds?.length
    ) {
      q = query(
        q,
        where("organizationId", "==", organizationId),
        where("trackId", "==", trackId),
        where("batchIds", "array-contains-any", batchIds)
      );
    }

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const rawTutors = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Tutor, "id">),
        }));

        // 이름 매핑
        const enrichedTutors = await Promise.all(
          rawTutors.map(async (tutor) => ({
            ...tutor,
            organizationName: await getNameById(
              "organizations",
              tutor.organizationId
            ),
            trackName: await getNameById(
              `organizations/${tutor.organizationId}/tracks`,
              tutor.trackId
            ),
            batchNames: await Promise.all(
              tutor.batchIds?.map((id) =>
                getNameById(
                  `organizations/${tutor.organizationId}/tracks/${tutor.trackId}/batches`,
                  id
                )
              ) || []
            ),
          }))
        );

        setTutors(enrichedTutors);
        setLoading(false);
      },
      (err) => {
        console.error("튜터 불러오기 실패:", err);
        setError("튜터 데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [role, organizationId, trackId, batchIds]);

  return { tutors, loading, error };
};
