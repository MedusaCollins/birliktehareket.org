"use client";

import DynamicComponent from "@/components/sections/userProfile/DynamicComp";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function UserPage() {
  const pathname = usePathname();
  const { userInfo } = useAuth();
  const isActive = (path: string) => pathname === path;

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full bg-gray-100">
      <div className="flex flex-col items-center w-full max-w-7xl bg-white shadow-lg rounded-lg p-8 pb-0 space-y-6">
        <div className="flex p-1 flex-col items-center justify-center space-y-4">
          <Avatar className="w-32 h-32 rounded-full border-4 ">
            <AvatarImage src={userInfo.image} />
            <AvatarFallback className="text-5xl">
              {userInfo.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-semibold">{userInfo.username}</h1>
          <div className="flex space-x-4">
            <span className="text-sm text-gray-500">
              Joined {userInfo.createdAt.slice(0, 10).split("-").reverse().join(".")}
            </span>
          </div>
        </div>

        <div className="flex justify-around w-full text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">
              {userInfo.walkDetails.supportedWalk.length}
            </span>
            <span className="text-sm text-gray-500">Attended Walks</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">
              {userInfo.walkDetails.ownWalk.length}
            </span>
            <span className="text-sm text-gray-500">Organized Walks</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">
              {userInfo.walkDetails.savedWalk.length}
            </span>
            <span className="text-sm text-gray-500">Saved Walks</span>
          </div>
        </div>

        <div className="w-full border-t border-gray-300 py-6 bg-white">
          <div className="flex flex-row justify-center items-center space-x-12 md:text-lg text-sm font-semibold text-gray-600">
            <Link
              href="/profile/attendedwalks"
              className={`hover:text-emerald-600 duration-300 transition-colors ${
                isActive("/profile/attendedwalks")
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : ""
              }`}
            >
              Attended Walks
            </Link>
            <Link
              href="/profile/organizedwalks"
              className={`hover:text-emerald-600 duration-300 transition-colors ${
                isActive("/profile/organizedwalks")
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : ""
              }`}
            >
              Organized Walks
            </Link>
            <Link
              href="/profile/savedwalks"
              className={`hover:text-emerald-600 duration-300 transition-colors ${
                isActive("/profile/savedwalks")
                  ? "border-b-2 border-emerald-600 text-emerald-600"
                  : ""
              }`}
            >
              Saved Walks
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`w-full max-w-7xl h-full p-2 bg-white rounded-lg mt-6 shadow-lg ${
          isActive("/profile/about") ? "hidden" : ""
        }`}
      >
        <DynamicComponent />
      </div>
    </div>
  );
}
