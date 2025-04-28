"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { db } from "../services/firebase";
import { watchAuthState } from "../services/auth";
import { doc, getDoc } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";

interface User {
  uid: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any; // 유연성을 위해 추가 (추후 필요한 필드 대응)
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // { uid, email, name, role }

  useEffect(() => {
    const unsubscribe = watchAuthState(async (firebaseUser: any) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as {
            email: string;
            name: string;
            role: string;
          };
          setUser({
            uid: firebaseUser.uid,
            email: data.email,
            name: data.name,
            role: data.role,
          });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
