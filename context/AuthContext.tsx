"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthContextType } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    try {
      const { data } = await axios.get("/api/auth/check-token");
      setIsLoggedIn(data.isLoggedIn);
      if (data.isLoggedIn && !userInfo) {
        await fetchUserInfo(data.userId);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const fetchUserInfo = async (id: string) => {
    try {
      const { data } = await axios.post("/api/user", { userId: id });
      setUserInfo(data.userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        fetchUserInfo,
        checkAuthStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
