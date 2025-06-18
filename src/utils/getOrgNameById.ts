import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * 주어진 컬렉션과 ID에 해당하는 문서에서 name 필드를 가져옴
 * @param collectionPath Firestore 경로 (ex: "organizations" 또는 "orgId/tracks")
 * @param id 해당 컬렉션 내 문서 ID
 * @returns 문서의 name 필드 또는 "-"
 */
export const getNameById = async (
  collectionPath: string,
  id?: string
): Promise<string> => {
  if (!id) return "-";

  try {
    const ref = doc(db, collectionPath, id);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data().name as string) : "-";
  } catch (error) {
    console.error(`❌ getNameById 실패 (${collectionPath}/${id}):`, error);
    return "-";
  }
};
