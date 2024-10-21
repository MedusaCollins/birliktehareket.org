"use client";

import Loading from "@/components/ui/(blocks)/loading";
import Posts from "@/components/ui/(blocks)/posts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Post } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Overview() {
  const [subjects] = useState<string[]>(["Politika", "Ekonomi"]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts?page=1&limit=5");
        setPosts(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center items-center w-full p-5 bg-red-500 rounded-t-3xl bg-white">
      <div className="container w-full space-y-5 ">
        <h1 className="text-xl font-semibold text-slate-900">
          Önemsediğin şeyler hakkında yapılmış olan yürüyüşleri keşfet
        </h1>
        {/* TODO: Add an image to background */}

        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Konu seç" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((value, index) => (
                <SelectItem key={index} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {posts.length < 1 ? (
          <Loading loading={true} />
        ) : (
          <Posts posts={posts} />
        )}
      </div>
    </div>
  );
}
