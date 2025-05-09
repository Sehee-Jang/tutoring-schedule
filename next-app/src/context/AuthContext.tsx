"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { db } from "@/services/firebase";
import { User, UserRole } from "@/types/user";
import { watchAuthState } from "@/services/auth";
import { doc, getDoc } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

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

  // 앱 시작할 때 localStorage에 저장된 user 복구
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = watchAuthState(
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as {
              email: string;
              name: string;
              role: string;
            };
            const newUser: User = {
              id: firebaseUser.uid,
              email: data.email,
              name: data.name,
              role: data.role as UserRole,
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
      }
    );

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.role === "admin";
  const isTutor = user?.role === "tutor";

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, isTutor }}>
      {children}
    </AuthContext.Provider>
  );
};
