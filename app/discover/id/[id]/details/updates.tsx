import Image from "next/image";
import calculateReadingTime from "@/lib/helpers/calculateReadingTime";
import formatDate from "@/lib/helpers/formatDate";
import React from "react";
import { usePostContext } from "@/context/PostContext";

const Updates = () => {
  const { post } = usePostContext();
  if (!post) return null;

  return (
    <>
      {post.updates?.map(
        (
          update: {
            date: Date;
            title: string;
            message: string;
            userId: string;
            userImage?: string;
            username?: string;
          },
          index: number,
        ) => {
          return (
            <article key={index} className="prose prose-xs mx-auto pt-2">
              <h2>{update.title}</h2>
              <div className="flex justify-items items-center gap-5 -mt-8">
                {update.userImage && (
                  <Image
                    src={update.userImage}
                    alt="avatar"
                    width={100}
                    height={100}
                    onClick={() => console.log("kullanıcı profiline git")}
                    className="w-12 h-12 rounded-full hover:cursor-pointer"
                  />
                )}
                <div className="flex flex-col">
                  <span
                    className="font-semibold hover:cursor-pointer"
                    onClick={() => console.log("kullanıcı profiline git")}
                  >
                    {update.username}
                  </span>
                  <div className="text-sm space-x-2">
                    <span>
                      {calculateReadingTime(update.message)} dakika okuma süresi
                    </span>
                    <span>•</span>
                    <span>{formatDate(update.date)}</span>
                  </div>
                </div>
              </div>
              <p>{update.message}</p>
            </article>
          );
        },
      )}
    </>
  );
};

export default Updates;
