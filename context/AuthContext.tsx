"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userInfo: User | null;
  saveWalk: (walkId: number) => Promise<void>;
  attendWalk: (walkId: number) => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  username: string;
  image: string;
  createdAt: string;
  walkDetails: WalkDetails;
}

interface WalkDetails {
  savedWalk: number[];
  ownWalk: number[];
  supportedWalk: number[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get("/api/auth/check-token");

      if (res.data) {
        const user = await axios.post("/api/user", { userId: res.data.userId });
        setUserInfo(user.data.userInfo);
      }
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const saveWalk = async (walkId: number) => {
    if (!userInfo) {
      console.error("You must have an account to save walks");
      return;
    }

    try {
      const res = await axios.post("/api/posts/save", { userId: userInfo.id, walkId });
      console.log("Walk saved:", res.data);
    } catch (e) {
      console.error("Error saving walk:", e);
    }
  };

  const attendWalk = async (walkId: number) => {
    if (!userInfo) {
      console.error("You must have an account to attend walks");
      return;
    }

    try {
      const res = await axios.post("/api/posts/attend", { userId: userInfo.id, walkId });
      console.log("Walk attended:", res.data);
    } catch (e) {
      console.error("Error attending walk:", e);
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
  }, [isLoggedIn]);
  // BUG: After attending in or saving a walk, it doesn't appear in the profile section without refreshing the page.
  // BUG: At the first time cookie return null thats why user and check-token endpoints work 2 times.

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userInfo, saveWalk, attendWalk, setIsLoggedIn, logout }}
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
