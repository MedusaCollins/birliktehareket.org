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
        console.log(response.data.data);

        // TODO: This is a temporary fix to filter out posts that ended. Need to implement a isActive section in the post object.
        const filteredResponse = response.data.data
          .map((group: { subject: string; posts: Post[] }) => ({
            subject: group.subject,
            posts: group.posts.filter(
              (post) => new Date(post.detail.startDate) > new Date(),
            ),
          }))
          .filter(
            (group: { subject: string; posts: Post[] }) =>
              group.posts.length > 0,
          );
        setPosts(filteredResponse);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center items-center p-4 bg-white">
      <div className="space-y-8 w-full max-w-[1400px]">
        {posts.length < 1 ? (
          <div className="pt-4 flex justify-center">
            <Loading loading={true} />
          </div>
        ) : (
          <div className="space-y-10">
            {posts.map((subject, index) => (
              <div
                key={index}
                className="border-b-2 pb-2 overflow-hidden max-w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <Link
                    href={`/discover/categories/${subject.subject}`}
                    className="text-lg font-semibold text-slate-600 uppercase hover:underline"
                  >
                    {subject.subject}
                  </Link>
                </div>

                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  breakpoints={{
                    653: { slidesPerView: 2 },
                    1000: { slidesPerView: 3 },
                    1300: { slidesPerView: 4 },
                  }}
                  className="space-x-7"
                >
                  {subject.posts.map((post: Post, idx: number) => (
                    <SwiperSlide key={idx}>
                      <PostCard post={post} subject={subject.subject} />
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
