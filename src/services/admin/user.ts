import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../../types/user";

export const fetchManagersByRole = async (
  role: "organization_admin" | "track_admin" | "batch_admin",
  organization?: string,
  trackId?: string,
  batchId?: string
): Promise<User[]> => {
  const usersRef = collection(db, "users");
  const filters = [where("role", "==", role)];

  if (organization) filters.push(where("organization", "==", organization));
  if (trackId) filters.push(where("track", "==", trackId));
  if (batchId) filters.push(where("batch", "==", batchId));

  const q = query(usersRef, ...filters);
  const snapshot = await getDocs(q);
  console.log(
    "📦 fetched managers:",
    snapshot.docs.map((d) => d.data())
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
    };
  }) as User[];
};
