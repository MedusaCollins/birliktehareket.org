"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilLine, ArrowLeft } from "lucide-react";
import { Post } from "@/lib/types";
import PostCard from "@/components/ui/(blocks)/postCard";
import Loading from "@/components/ui/(blocks)/loading";
import useProfileHandler from "@/hooks/useProfileHandler";

export default function UserPage() {
  const {
    id,
    userId,
    displayData,
    section,
    handleLoadingChange,
    isLoading,
    sectionTitles,
    walkDetails,
    walkSections,
  } = useProfileHandler();

  if (!displayData || !walkDetails) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center sm:p-2 md:p-6 w-full h-full bg-gray-100 gap-12">
      <div className="flex flex-col items-center w-full max-w-[1400px] bg-white shadow-lg rounded-lg p-8 pb-0 space-y-6">
        <div className="flex p-1 flex-col items-center justify-center space-y-4">
          <Avatar className="w-32 h-32 rounded-full border-4 relative group">
            <AvatarImage src={displayData.image} className="hover:backdrop-filter object-cover" />
            {userId === id && (
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity">
                <div className="absolute inset-0 flex items-center justify-center select-none">
                  <PencilLine className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity mr-0.5" />
                  <h3 className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit
                  </h3>
                </div>
              </div>
            )}
            <AvatarFallback className="text-5xl select-none">
              {displayData.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-4xl font-semibold">{displayData.username}</h1>
          <span className="text-sm text-gray-500">
            Joined {new Date(displayData.createdAt).toLocaleDateString("tr-TR")}
          </span>
        </div>

        <div className="flex justify-around w-full text-center">
          {[
            {
              label: "Attended Walks",
              count: walkDetails.supportedWalk.length,
            },
            { label: "Organized Walks", count: walkDetails.ownWalk.length },
            { label: "Saved Walks", count: walkDetails.savedWalk.length },
          ].map(({ label, count }) => (
            <div className="flex flex-col" key={label}>
              <span className="text-2xl font-bold text-emerald-600">{count}</span>
              <span className="text-sm text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        <div className="w-full border-t border-gray-300 py-6 bg-white">
          <div className="flex justify-center space-x-12 md:text-lg md:text-left text-sm text-center font-semibold text-gray-600">
            {["attendedwalks", "organizedwalks", "savedwalks"].map(
              (type: string, index: number) => (
                <div
                  key={index}
                  onClick={() =>
                    handleLoadingChange(type as "attendedwalks" | "organizedwalks" | "savedwalks")
                  }
                  className={`hover:text-emerald-600 cursor-pointer duration-300 transition-colors ${
                    section === type ? "border-b-2 border-emerald-600 text-emerald-600" : ""
                  }`}
                >
                  {sectionTitles[type]}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center p-4 bg-white shadow-lg rounded-lg w-full max-w-[1400px]">
        {isLoading ? (
          <Loading loading={true} />
        ) : (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 w-full">
            {Array.isArray(walkSections[section]) && walkSections[section].length > 0 ? (
              walkSections[section].map(
                (post: Post) =>
                  post && (
                    <PostCard
                      key={post._id?.toString()}
                      post={post}
                      subject={post.detail.subject}
                    />
                  )
              )
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
                <ArrowLeft className="size-20" />
                <h1 className="text-lg font-semibold">No Walks Found</h1>
                <p className="text-sm text-gray-400">
                  Try exploring other sections or check back later.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
