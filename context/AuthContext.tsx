"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: any;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const checkAuthStatus = async () => {
    const res = await axios.get("/api/auth/check-token");

    if (res.data.isLoggedIn) {
      const user = await axios.post("/api/user", { userId: res.data.userId });
      setUserInfo(user.data.userInfo);
    }

    setIsLoggedIn(res.data.isLoggedIn);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "GET", credentials: "include" });
    setIsLoggedIn(false);
    setUserInfo(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, setIsLoggedIn, logout }}>
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
