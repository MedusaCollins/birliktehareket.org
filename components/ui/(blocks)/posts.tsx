"use client";

import { Post } from "@/lib/types";
import PostCard from "./postCard";

const posts = ({ posts }: { posts: Post[] }) => {
  if (posts) {
    return (
      <div className="flex grid-cols-2 justify-between">
        <PostCard post={posts[0]} isLarge={true} />

        <div className="col-span-1 grid grid-cols-2 gap-5 ">
          {posts.slice(1).map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </div>
    );
  }
};

export default posts;
