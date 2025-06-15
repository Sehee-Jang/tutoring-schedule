import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

// 역할 생성
export const createRole = async (
  organizationId: string,
  name: string,
  permissions: Record<string, boolean>
) => {
  await addDoc(collection(db, "roles"), {
    organization_id: organizationId,
    name,
    permissions,
    createdAt: new Date(),
  });
};

// 사용자 권한 변경
export const setUserRole = async (uid: string, role: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { role });
};
