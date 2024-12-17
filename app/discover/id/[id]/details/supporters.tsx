import { usePostContext } from "@/context/PostContext";
import Image from "next/image";
import React from "react";

const Supporters = () => {
  const { post } = usePostContext();
  if (!post) return null;

  return (
    <>
      {post.supporters?.map(
        (
          supporter: {
            date: string;
            userId: string;
            userImage?: string;
            username?: string;
          },
          index: number,
        ) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-items items-center"
            >
              {supporter.userImage && (
                <Image
                  key={index}
                  src={supporter.userImage}
                  alt="avatar"
                  width={100}
                  height={100}
                  onClick={() => console.log("kullanıcı profiline git")}
                  className="w-12 h-12 rounded-full hover:cursor-pointer"
                />
              )}
              <h3 onClick={() => console.log("kullanıcı profiline git")}>
                {supporter.username}
              </h3>
            </div>
          );
        },
      )}
    </>
  );
};

export default Supporters;
