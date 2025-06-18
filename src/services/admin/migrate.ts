import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const migrateBatchIdToBatchIds = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  const tutors = snapshot.docs.filter((doc) => {
    const data = doc.data();
    return data.role === "tutor" && data.batchId && !data.batchIds;
  });

  for (const tutor of tutors) {
    const data = tutor.data();
    const userRef = doc(db, "users", tutor.id);
    await updateDoc(userRef, {
      batchIds: [data.batchId],
      batchId: null,
    });
  }

  return tutors.length;
};
