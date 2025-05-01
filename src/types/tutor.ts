export type TutorStatus = "active" | "inactive" | "pending";

export interface Tutor {
  id: string; // Firestore document ID
  name: string;
  email: string;
  status: TutorStatus;
}
