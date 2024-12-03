"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthContextType } from "@/lib/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get("/api/auth/check-token");

      if (res.data.isLoggedIn && !userInfo) {
        getUserInfo(res.data.userId);
      }

      setIsLoggedIn(res.data.isLoggedIn);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const getUserInfo = async (id: string) => {
    try {
      const res = await axios.post("/api/user", { userId: id });
      setUserInfo(res.data.userInfo);
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  const getProfileData = async (id: string) => {
    try {
      const res = await axios.post("/api/user", { userId: id });
      setProfileData(res.data.userInfo);
    } catch (error) {
      setUserNotFound(true);
      console.error("Error getting user info:", error);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "GET", credentials: "include" });
      setIsLoggedIn(false);
      setUserInfo(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        userNotFound,
        profileData,
        checkAuthStatus,
        getProfileData,
        setIsLoggedIn,

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
