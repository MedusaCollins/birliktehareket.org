"use client";

import DynamicComponent from "@/components/sections/userProfile/DynamicComp";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "next/navigation";
import { PencilLine } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const { id, section } = useParams();
  const { userNotFound, userInfo, profileData, getProfileData } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => section === path;
  const isOwnProfile = userInfo?.id === id;

  useEffect(() => {
    if (!isOwnProfile && id && profileData?.id !== id) {
      getProfileData(id as string);
    }
  }, [id]);

  useEffect(() => {
    const sections = ["savedwalks", "organizedwalks", "attendedwalks", "about"];

    if (!sections.includes(section as string) || userNotFound) {
      router.push("/404");
    }
  }, [section, userNotFound]);

  const displayData = isOwnProfile ? userInfo : profileData;

  if (!displayData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center sm:p-2 md:p-6 w-full h-full bg-gray-100">
      <div className="flex flex-col items-center w-full md:max-w-7xl bg-white shadow-lg rounded-lg p-8 pb-0 space-y-6">
        <div className="flex p-1 flex-col items-center justify-center space-y-4">
          <Avatar className="w-32 h-32 rounded-full border-4 relative group">
            <AvatarImage src={displayData.image} className="hover:backdrop-filter object-cover" />
            {isOwnProfile ? (
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity">
                <div
                  className="absolute inset-0 flex items-center justify-center select-none"
                  onClick={() => {
                    console.log("Create Issue");
                  }}
                >
                  <PencilLine className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity mr-0.5" />
                  <h3 className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit
                  </h3>
                </div>
              </div>
            ) : null}
            <AvatarFallback className="text-5xl select-none">
              {displayData.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-semibold">{displayData.username}</h1>
          <div className="flex space-x-4">
            <span className="text-sm text-gray-500">
              Joined {displayData.createdAt.slice(0, 10).split("-").reverse().join(".")}
            </span>
          </div>
        </div>

        <div className="flex justify-around w-full text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">
              {displayData.walkDetails.supportedWalk.length}
            </span>
            <span className="text-sm text-gray-500">Attended Walks</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">
              {displayData.walkDetails.ownWalk.length}
            </span>
            <span className="text-sm text-gray-500">Organized Walks</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-emerald-600">
              {displayData.walkDetails.savedWalk.length}
            </span>
            <span className="text-sm text-gray-500">Saved Walks</span>
          </div>
        </div>

        <div className="w-full border-t border-gray-300 py-6 bg-white">
          <div className="flex flex-row justify-center items-center space-x-12 md:text-lg md:text-left text-sm text-center font-semibold text-gray-600">
            <Link
              href={`/profile/${id}/attendedwalks`}
              className={`hover:text-emerald-600 duration-300 transition-colors ${
                isActive("attendedwalks") ? "border-b-2 border-emerald-600 text-emerald-600" : ""
              }`}
            >
              Attended Walks
            </Link>
            <Link
              href={`/profile/${id}/organizedwalks`}
              className={`hover:text-emerald-600 duration-300 transition-colors ${
                isActive("organizedwalks") ? "border-b-2 border-emerald-600 text-emerald-600" : ""
              }`}
            >
              Organized Walks
            </Link>
            <Link
              href={`/profile/${id}/savedwalks`}
              className={`hover:text-emerald-600 duration-300 transition-colors ${
                isActive("savedwalks") ? "border-b-2 border-emerald-600 text-emerald-600" : ""
              }`}
            >
              Saved Walks
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`w-full max-w-7xl h-full p-2 bg-white rounded-lg mt-6 shadow-lg ${
          isActive("about") ? "hidden" : ""
        }`}
      >
        <DynamicComponent />
      </div>
    </div>
  );
}
