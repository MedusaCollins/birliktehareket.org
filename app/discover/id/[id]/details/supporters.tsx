import { usePostContext } from "@/context/PostContext";
import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Supporters = () => {
  const { post } = usePostContext();
  if (!post) return null;

  return (
    <>
      {post.supporters?.map(
        (supporter: { date: string; userId: string; userImage?: string; username?: string }) => {
          return (
            <Link key={supporter.userId} href={`/profile/${supporter.userId}`}>
              <div className="flex flex-col justify-items items-center">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={supporter.userImage} className="object-cover" />
                  <AvatarFallback className="text-sm font-semibold">
                    {supporter.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="truncate max-w-[83px]">{supporter.username}</h3>
              </div>
            </Link>
          );
        }
      )}
    </>
  );
};

export default Supporters;
