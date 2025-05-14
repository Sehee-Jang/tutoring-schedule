import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Track 타입 정의
interface Track {
  id: string;
  name: string;
}

// Track 타입 정의
interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// 조직 목록 불러오기
export const fetchOrganizations = async () => {
  const snapshot = await getDocs(collection(db, "organizations"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

// 트랙 목록 불러오기
export const fetchTracks = async (organizationId: string): Promise<Track[]> => {
  const snapshot = await getDocs(
    collection(db, `organizations/${organizationId}/tracks`)
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "",
  }));
};

// 기수 목록 불러오기
export const fetchBatches = async (
  organizationId: string,
  trackId: string
): Promise<Batch[]> => {
  const snapshot = await getDocs(
    collection(db, `organizations/${organizationId}/tracks/${trackId}/batches`)
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "",
    startDate: doc.data().startDate || "",
    endDate: doc.data().endDate || "",
  }));
};

// 새로운 조직 생성
export const createOrganization = async (newOrganization: string) => {
  if (!newOrganization.trim()) throw new Error("조직명을 입력하세요.");
  await addDoc(collection(db, "organizations"), {
    name: newOrganization,
  });
};

/// 트랙 생성
export const createTrack = async (organizationId: string, newTrack: string) => {
  if (!newTrack.trim()) return;

  await addDoc(collection(db, `organizations/${organizationId}/tracks`), {
    name: newTrack,
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
    }
  );
};


// 조직 삭제
export const deleteOrganization = async (organizationId: string) => {
  await deleteDoc(doc(db, "organizations", organizationId));
};

// 트랙 삭제
export const deleteTrack = async (organizationId: string, trackId: string) => {
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
