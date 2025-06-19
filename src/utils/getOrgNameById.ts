import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

// 🔒 전역 캐시
const nameCache = new Map<string, string>();

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

  const cacheKey = `${collectionPath}/${id}`;
  if (nameCache.has(cacheKey)) {
    return nameCache.get(cacheKey)!;
  }

  try {
    const ref = doc(db, collectionPath, id);
    const snap = await getDoc(ref);
    const name = snap.exists() ? (snap.data().name as string) : "-";
    nameCache.set(cacheKey, name);
    return name;
  } catch (error) {
    console.error(`❌ getNameById 실패 (${collectionPath}/${id}):`, error);
    return "-";
  }
};
