import { AuthProvider } from "@/context/AuthContext";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
