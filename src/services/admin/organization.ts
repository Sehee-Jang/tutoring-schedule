import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  collectionGroup,
} from "firebase/firestore";
import { sortByName, sortByNumericBatch } from "../../utils/sortUtils";
import { Track } from "../../types/track";
import { Batch } from "../../types/batch";

// 조직 목록 불러오기
export const fetchOrganizations = async () => {
  const snapshot = await getDocs(collection(db, "organizations"));
  const organizations = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    created_at: doc.data().created_at
      ? doc.data().created_at.toDate()
      : new Date(),
    updated_at: doc.data().updated_at
      ? doc.data().updated_at.toDate()
      : new Date(),
  }));
  return sortByName(organizations);
};

// 트랙 목록 불러오기
// export const fetchTracks = async (organizationId: string): Promise<Track[]> => {
//   const snapshot = await getDocs(
//     collection(db, `organizations/${organizationId}/tracks`)
//   );
//   const tracks= snapshot.docs.map((doc) => ({
//     id: doc.id,
//     name: doc.data().name || "",
//   }))
//   return sortByName(tracks);
// };

// 트랙 목록 불러오기 (기수 포함, 가나다 정렬)
export const fetchTracks = async (organizationId: string): Promise<Track[]> => {
  const snapshot = await getDocs(
    collection(db, `organizations/${organizationId}/tracks`)
  );

  const tracks = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const batchesSnapshot = await getDocs(
        collection(
          db,
          `organizations/${organizationId}/tracks/${doc.id}/batches`
        )
      );

      const batches = batchesSnapshot.docs.map((batchDoc) => ({
        id: batchDoc.id,
        name: batchDoc.data().name || "",
        startDate: batchDoc.data().startDate || "",
        endDate: batchDoc.data().endDate || "",
        created_at: batchDoc.data().created_at
          ? batchDoc.data().created_at.toDate()
          : new Date(),
        updated_at: batchDoc.data().updated_at
          ? batchDoc.data().updated_at.toDate()
          : new Date(),
      }));

      return {
        id: doc.id,
        name: doc.data().name || "",
        batches: sortByNumericBatch(batches), // 기수 정렬 (숫자 기반)
        created_at: doc.data().created_at
          ? doc.data().created_at.toDate()
          : new Date(),
        updated_at: doc.data().updated_at
          ? doc.data().updated_at.toDate()
          : new Date(),
      };
    })
  );

  return sortByName(tracks); // 트랙 가나다 정렬
};

// 기수 목록 불러오기 (가나다 정렬)
export const fetchBatches = async (
  organizationId: string,
  trackId: string
): Promise<Batch[]> => {
  const snapshot = await getDocs(
    collection(db, `organizations/${organizationId}/tracks/${trackId}/batches`)
  );
  const batches: Batch[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "",
    startDate: doc.data().startDate || "",
    endDate: doc.data().endDate || "",
    created_at: doc.data().created_at
      ? doc.data().created_at.toDate()
      : new Date(),
    updated_at: doc.data().updated_at
      ? doc.data().updated_at.toDate()
      : new Date(),
  }));
  return sortByNumericBatch(batches);
};

// 새로운 조직 생성
export const createOrganization = async (newOrganization: string) => {
  if (!newOrganization.trim()) throw new Error("조직명을 입력하세요.");
  await addDoc(collection(db, "organizations"), {
    name: newOrganization,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

/// 트랙 생성
export const createTrack = async (organizationId: string, newTrack: string) => {
  if (!newTrack.trim()) return;

  await addDoc(collection(db, `organizations/${organizationId}/tracks`), {
    name: newTrack,
    created_at: new Date(),
    updated_at: new Date(),
  });
};

// 기수 추가 (Firestore의 서브컬렉션 사용)
export const createBatch = async (
  organizationId: string,
  trackId: string,
  newBatch: string,
  newStartDate: string,
  newEndDate: string
) => {
  if (!newBatch.trim() || !newStartDate || !newEndDate)
    throw new Error("기수명을 입력하세요.");

  // 기수는 트랙 하위에 저장
  await addDoc(
    collection(db, `organizations/${organizationId}/tracks/${trackId}/batches`),
    {
      name: newBatch,
      startDate: newStartDate,
      endDate: newEndDate,
      created_at: new Date(),
      updated_at: new Date(),
    }
  );
};

// 조직 삭제
export const deleteOrganization = async (organizationId: string) => {
  await deleteDoc(doc(db, "organizations", organizationId));
};

// 트랙 삭제 (기수도 함께 삭제)
export const deleteTrack = async (organizationId: string, trackId: string) => {
  const batchesSnapshot = await getDocs(
    collection(db, `organizations/${organizationId}/tracks/${trackId}/batches`)
  );

  for (const batchDoc of batchesSnapshot.docs) {
    await deleteDoc(batchDoc.ref);
  }

  await deleteDoc(doc(db, `organizations/${organizationId}/tracks`, trackId));
};

// 기수 삭제
export const deleteBatch = async (
  organizationId: string,
  trackId: string,
  batchId: string
) => {
  await deleteDoc(
    doc(
      db,
      `organizations/${organizationId}/tracks/${trackId}/batches`,
      batchId
    )
  );
};

// 업데이트 조직
export const updateOrganization = async (
  organizationId: string,
  newName: string
) => {
  if (!newName.trim()) throw new Error("조직명을 입력하세요.");

  const orgRef = doc(db, "organizations", organizationId);
  await updateDoc(orgRef, {
    name: newName,
    updated_at: new Date(),
  });
};

// 업데이트 트랙
export const updateTrack = async (
  organizationId: string,
  trackId: string,
  newName: string
) => {
  if (!newName.trim()) throw new Error("트랙명을 입력하세요.");

  const trackRef = doc(db, `organizations/${organizationId}/tracks`, trackId);
  await updateDoc(trackRef, {
    name: newName,
    updated_at: new Date(),
  });
};

// 업데이트 기수
export const updateBatch = async (
  organizationId: string,
  trackId: string,
  batchId: string,
  newName: string,
  newStartDate: string,
  newEndDate: string
) => {
  if (!newName.trim() || !newStartDate || !newEndDate)
    throw new Error("기수명과 날짜를 입력하세요.");

  const batchRef = doc(
    db,
    `organizations/${organizationId}/tracks/${trackId}/batches`,
    batchId
  );
  await updateDoc(batchRef, {
    name: newName,
    startDate: newStartDate,
    endDate: newEndDate,
    updated_at: new Date(),
  });
};

// trackId로 organizationId 찾기
export const fetchTrackById = async (trackId: string) => {
  const snapshot = await getDocs(collectionGroup(db, "tracks"));

  const trackDoc = snapshot.docs.find((doc) => doc.id === trackId);
  if (!trackDoc) throw new Error("해당 트랙을 찾을 수 없습니다.");

  const organizationId = trackDoc.ref.parent.parent?.id; // organizations/{orgId}/tracks/{trackId}
  if (!organizationId) throw new Error("상위 조직 ID를 찾을 수 없습니다.");

  return {
    id: trackDoc.id,
    name: trackDoc.data().name,
    organizationId,
    created_at: trackDoc.data().created_at
      ? trackDoc.data().created_at.toDate()
      : new Date(),
    updated_at: trackDoc.data().updated_at
      ? trackDoc.data().updated_at.toDate()
      : new Date(),
  };
};
