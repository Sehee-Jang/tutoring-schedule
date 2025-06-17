import { auth, db } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const login = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const watchAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Firestore에 사용자 정보가 없으면 생성
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      name: user.displayName || "이름",
      email: user.email,
      role: "student", // 기본은 수강생으로 등록
      status: "active", // 수강생은 바로 활성화
      createdAt: serverTimestamp(),
    });
  }

  return user;
};
