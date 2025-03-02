import Link from "next/link";
import calculateReadingTime from "@/lib/helpers/calculateReadingTime";
import formatDate from "@/lib/helpers/formatDate";
import React from "react";
import { usePostContext } from "@/context/PostContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Updates = () => {
  const { post } = usePostContext();
  if (!post) return null;

  return (
    <>
      {post.updates?.map(
        (
          update: {
            date: string;
            title: string;
            message: string;
            userId: string;
            userImage?: string;
            username?: string;
          },
          index: number
        ) => {
          return (
            <article key={index} className="prose prose-xs mx-auto pt-2 space-y-2">
              <h2>{update.title}</h2>
              <div className="flex justify-items items-center gap-5 -mt-8">
                <div className="flex space-x-3 items-center">
                  <Link href={`/profile/${update.userId}`}>
                    <Avatar className="flex items-center">
                      <AvatarImage src={update.userImage} className="object-cover" />
                      <AvatarFallback className="text-sm font-semibold">
                        {update.username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex flex-col">
                    <Link
                      className="font-semibold hover:cursor-pointer no-underline w-fit"
                      href={`profile/${update.userId}`}
                    >
                      {update.username}
                    </Link>
                    <div className="text-sm space-x-2">
                      <span>{calculateReadingTime(update.message)} dakika okuma süresi</span>
                      <span>•</span>
                      <span>{formatDate(new Date(update.date))}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p>{update.message}</p>
            </article>
          );
        }
      )}
    </>
  );
};

export default Updates;
