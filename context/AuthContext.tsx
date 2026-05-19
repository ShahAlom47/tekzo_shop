"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/interfaces/userInterface";



type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? (JSON.parse(storedUser) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 🔥 Protect dashboard routes
  useEffect(() => {
    if (!loading && !user && pathname.startsWith("/dashboard")) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  // 🔥 login function
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push("/dashboard");
  };

  // 🔥 logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 hook
export const useUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUser must be used inside AuthProvider");
  }

  return context;
};