"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { db } from "../services/firebase";
import { User, UserRole, UserStatus } from "../types/user";
import { watchAuthState } from "../services/auth";
import { doc, getDoc } from "firebase/firestore";
import { isAdminRole } from "../utils/roleUtils";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isTutor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAdmin: false,
  isTutor: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState(async (firebaseUser: any) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data() as {
            email: string;
            name: string;
            role: string;
            status?: string;
            organizationId?: string;
            trackId?: string;
            batchId?: string;
          };

          // 비활성 계정이면 즉시 로그아웃
          if (data.status === "inactive") {
            console.warn("🚫 접근 불가 상태: inactive");
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("user");
            setIsLoading(false);
            return;
          }

          // 승인 대기 상태 계정인 경우
          if (data.status === "pending") {
            console.info("ℹ️ 승인 대기 상태: pending");
            const pendingUser: User = {
              id: firebaseUser.uid,
              email: data.email,
              name: data.name,
              role: data.role as UserRole,
              organizationId: data.organizationId ?? null,
              trackId: data.trackId ?? null,
              batchId: data.batchId ?? null,
              status: data.status ?? "pending",
            };
            setUser(pendingUser); // user는 유지
            localStorage.setItem("user", JSON.stringify(pendingUser));
            setIsLoading(false);
            return;
          }

          const newUser: User = {
            id: firebaseUser.uid,
            email: data.email,
            name: data.name,
            role: data.role as UserRole,
            organizationId: data.organizationId ?? null,
            trackId: data.trackId ?? null,
            batchId: data.batchId ?? null,
            status: (data.status as UserStatus) ?? "active",
          };
          setUser(newUser);

          // localStorage에 저장
          localStorage.setItem("user", JSON.stringify(newUser));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = isAdminRole(user?.role);
  const isTutor = user?.role === "tutor";

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, isTutor }}>
      {children}
    </AuthContext.Provider>
  );
};
