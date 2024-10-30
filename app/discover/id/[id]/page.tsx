"use client";

import Image from "next/image";
import InfoPanel from "@/components/sections/walkDetail/infoPanel";
import { Post } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function WalkDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getPost() {
      const response = await axios.get(`/api/posts/${params.id}`);
      if (response.data.success) {
        setPost(response.data.data);
        setLoading(false);
      } else {
        console.error(response.data.message);
      }
    }
    getPost();
  }, [params.id]);

  {
    /* TODO: Add a loading and error design */
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-slate-700 mt-10">{post.title}</h1>
      <div className="grid grid-cols-3 gap-4 py-12 px-5 overflow-hidden max-w-[1200px] w-screen mx-auto">
        <div className="lg:col-span-2 col-span-3 w-full">
          <Image
            src={post.images[0]}
            alt="post image"
            className="mx-auto"
            width={825}
            height={100}
          />
        </div>
        <InfoPanel post={post} />
      </div>
    </div>
  );
}
