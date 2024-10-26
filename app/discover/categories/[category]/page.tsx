"use client";

import Loading from "@/components/ui/(blocks)/loading";
import PostCard from "@/components/ui/(blocks)/postCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { category: string } }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function getPosts() {
      const response = await axios.get(
        `/api/posts?page=1&limit=9&subject=${params.category}`,
      );
      console.log(response.data);
      setPosts(response.data.data);
      setTotalItems(response.data.totalItems);
      setLoading(false);
    }
    getPosts();
  }, [params.category]);

  async function getMorePosts() {
    try {
      if (page * 9 < totalItems) {
        const response = await axios.get(
          `/api/posts?page=${page}&limit=9&subject=${params.category}`,
        );
        setPage(page + 1);
        setPosts((posts) => [...posts, ...response.data.data]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 space-y-3 overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          <Loading loading={true} />
        </div>
      ) : (
        <div className="py-12 px-5 max-w-[1200px] w-screen flex flex-col space-y-5">
          <div className="text-xl font-medium text-slate-700">
            <span className="text-green-500">{params.category}</span> başlığında{" "}
            <span className="text-green-500">{totalItems}</span> yürüyüş
            listelendi
          </div>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 justify-items-center">
            {posts.map((post, index) => (
              <PostCard post={post} key={index} />
            ))}
          </div>
          {page * 9 < totalItems && (
            <Button
              onClick={getMorePosts}
              className="px-4 py-2 text-white w-fit rounded-sm mx-auto"
              size="lg"
            >
              Daha Fazla Göster
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
