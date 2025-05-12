import { db, auth } from "./firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

// 새 관리자 계정 생성 함수 (Firebase v9+)
export async function createAdminAccount(email: string, password: string) {
  try {
    // Firebase Authentication에서 관리자 계정 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user) throw new Error("관리자 계정 생성 실패");

    // Firestore에서 사용자 역할을 Admin으로 설정
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: "admin",
      status: "active",
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    console.log(`✅ 관리자 계정 생성 완료: ${user.email}`);
  } catch (error) {
    console.error("❌ 관리자 계정 생성 오류:", error);
  }
}
