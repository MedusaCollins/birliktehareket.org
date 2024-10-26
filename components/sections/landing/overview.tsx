"use client";

import Loading from "@/components/ui/(blocks)/loading";
import PostCard from "@/components/ui/(blocks)/postCard";
import { Post, PostList } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

export default function Overview() {
  const [posts, setPosts] = useState<PostList[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `/api/posts?page=1&limit=10&subject=categorized`,
        );
        setPosts(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center items-center p-5 rounded-t-3xl bg-white">
      <div className="space-y-5">
        <h1 className="text-xl font-semibold text-slate-900 px-2">
          Önemsediğin konular hakkında yapılmış olan yürüyüşleri keşfet
        </h1>
        {posts.length < 1 ? (
          <div className="pt-4">
            <Loading loading={true} />
          </div>
        ) : (
          <div>
            {posts.map((subject, index) => (
              <div
                key={index}
                className="border-b-2 p-2 w-screen max-w-[1200px] overflow-auto"
              >
                <div className="flex justify-between items-center">
                  <Link
                    href={"/discover/categories/" + subject.subject}
                    className="text-lg font-semibold text-slate-600 uppercase hover:underline"
                  >
                    {subject.subject}
                  </Link>
                </div>

                <Swiper
                  slidesPerView={1}
                  breakpoints={{
                    540: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                  }}
                >
                  {subject.posts.map((post: Post, index: number) => (
                    <SwiperSlide key={index}>
                      <PostCard post={post} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
