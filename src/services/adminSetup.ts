import { db, auth } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function createAdminAccount(
  email: string,
  password: string,
  role: string,
  organizationId?: string,
  trackId?: string,
  batchId?: string
) {
  if (role === "super_admin") {
    throw new Error("슈퍼관리자 계정은 직접 생성할 수 없습니다.");
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  if (!user) throw new Error("관리자 계정 생성 실패");

  const userData: { [key: string]: any } = {
    email: user.email,
    role,
    status: "active",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  if (organizationId) userData.organization = organizationId;
  if (trackId) userData.track = trackId;
  if (batchId) userData.batch = batchId;

  await setDoc(doc(db, "users", user.uid), userData);
  console.log(`✅ ${role} 계정 생성 완료: ${user.email}`);
}
