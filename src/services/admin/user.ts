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
  if (trackId) filters.push(where("trackId", "==", trackId));
  if (batchId) filters.push(where("batchId", "==", batchId));

  const q = query(usersRef, ...filters);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as User);
};
