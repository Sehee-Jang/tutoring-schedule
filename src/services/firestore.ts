import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  serverTimestamp,
} from "firebase/firestore";

// Organizations 생성 함수
export async function createOrganization(
  name: string,
  description: string,
  logoUrl: string = ""
) {
  const orgRef = await addDoc(collection(db, "organizations"), {
    name,
    description,
    logo_url: logoUrl,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return orgRef.id;
}

// Tracks 생성 함수
export async function createTrack(
  organizationId: string,
  trackName: string,
) {
  const trackRef = await addDoc(
    collection(db, `organizations/${organizationId}/tracks`),
    {
      name: trackName,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }
  );
  return trackRef.id;
}

// Batch 생성 함수 (트랙 하위에 추가)
export async function createBatch(
  organizationId: string,
  trackId: string,
  batchName: string,
  startDate: string,
  endDate: string
) {
  await addDoc(
    collection(db, `organizations/${organizationId}/tracks/${trackId}/batches`),
    {
      name: batchName,
      startDate,
      endDate,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }
  );
}
// Roles 생성 함수
export async function createRole(
  organizationId: string,
  roleName: string,
  permissions: Record<string, boolean>
) {
  await addDoc(collection(db, "roles"), {
    organization_id: organizationId,
    name: roleName,
    permissions,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
}

// 기본 역할 권한 설정 (admin, tutor, student)
export const defaultRoles: {
  name: string;
  permissions: Record<string, boolean>;
}[] = [
  {
    name: "admin",
    permissions: {
      can_create_reservation: true,
      can_manage_users: true,
      can_view_all_reservations: true,
      can_edit_reservations: true,
    },
  },
  {
    name: "tutor",
    permissions: {
      can_view_assigned_reservations: true,
      can_edit_assigned_reservations: true,
      can_delete_assigned_reservations: true,
      can_create_reservation: false,
      can_view_own_reservations: false,
    },
  },
  {
    name: "student",
    permissions: {
      can_create_reservation: true,
      can_view_own_reservations: true,
      can_edit_own_reservations: true,
      can_view_assigned_reservations: false, // Student는 다른 사람 예약 확인 불가
      can_edit_assigned_reservations: false,
      can_delete_assigned_reservations: false,
    },
  },
];

// Roles 조회 함수
export async function getRoles(organizationId: string) {
  const rolesRef = collection(db, "roles");
  const q = query(rolesRef, where("organization_id", "==", organizationId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
