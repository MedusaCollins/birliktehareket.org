"use client";

import axios from "axios";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userNotFound: boolean;
  userInfo: User | null;
  profileData: User | null;
  checkAuthStatus: () => Promise<void>;
  setIsLoggedIn: (value: boolean) => void;
  getProfileData: (id: string) => Promise<void>;
  setProfileData: (userInfo: User | null) => void;
  saveWalk: (walkId: number) => Promise<void>;
  attendWalk: (walkId: number) => Promise<void>;
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

  const saveWalk = async (walkId: number) => {
    if (!userInfo) {
      console.error("You must have an account to save walks");
      return;
    }

    try {
      const res = await axios.post("/api/posts/save", { userId: userInfo.id, walkId });
      console.log("Walk saved:", res.data);

      if (res.data.walk) {
        userInfo.walkDetails.savedWalk.push(walkId);
      } else {
        userInfo.walkDetails.savedWalk = userInfo.walkDetails.savedWalk.filter(
          (id) => id !== walkId
        );
      }
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

      if (res.data.walk) {
        userInfo.walkDetails.supportedWalk.push(walkId);
      } else {
        userInfo.walkDetails.supportedWalk = userInfo.walkDetails.supportedWalk.filter(
          (id) => id !== walkId
        );
      }
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
        saveWalk,
        attendWalk,
        setIsLoggedIn,
        setProfileData,
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
