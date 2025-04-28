export interface Tutor {
  id: string; // Firestore document ID
  name: string;
  email: string;
  status: "active" | "inactive";
}
