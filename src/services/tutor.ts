import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

export const toggleTutorStatus = async (
  tutorId: string,
  currentStatus: string
) => {
  const tutorRef = doc(db, "users", tutorId);
  const newStatus = currentStatus === "active" ? "inactive" : "active";
  await updateDoc(tutorRef, { status: newStatus });
  return newStatus;
};

export const updateTutorInfo = async (
  tutorId: string,
  name: string,
  email: string
) => {
  const tutorRef = doc(db, "users", tutorId);
  await updateDoc(tutorRef, { name, email });
};
