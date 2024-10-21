"use client";

import { Post } from "@/lib/types";
import Image from "next/image";

function formatPeople(peopleNumber: number) {
  return peopleNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const posts = ({ posts }: { posts: Post[] }) => {
  if (posts) {
    return (
      <div className="grid grid-cols-2 gap-10">
        <div className="col-span-1 flex flex-col space-y-3">
          <Image
            src={posts[0].images[0]}
            alt="post-image"
            width={700}
            height={300}
            className="rounded-xl"
          />
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">{posts[0].title}</h1>
            <h3 className="text-sm font-semibold text-slate-700">
              {posts[0].organizer}
            </h3>
            <p className="text-sm text-slate-700">{posts[0].desciption}</p>
          </div>
        </div>
        <div className="col-span-1 grid grid-cols-2 gap-8">
          {posts.map((post: Post, index: number) => {
            if (index != 0) {
              return (
                <div
                  key={index}
                  className="flex flex-col space-y-3 mx-auto p-5 hover:bg-red-200 transition-all cursor-pointer h-[300px] rounded-md"
                >
                  <Image
                    src={post.images[0]}
                    alt="post-image"
                    width={250}
                    height={125}
                    className="rounded-xl"
                  />
                  <div className="space-y-2">
                    <h1 className="text-xl font-semibold">{post.title}</h1>
                    <h3 className="text-sm font-semibold text-slate-700">
                      {post.organizer}
                    </h3>
                    <p className="text-sm text-slate-700">
                      {post.supporters &&
                        formatPeople(post.supporters.length) +
                        " kişi bu yürüyüşe katılıyor!"}
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
};

export default posts;
