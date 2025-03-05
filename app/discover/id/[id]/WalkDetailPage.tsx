"use client";

import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostContext } from "@/context/PostContext";

import ImagePreview from "./imagePreview";
import InfoBar from "./infoBar";
import About from "./details/about";
import Updates from "./details/updates";
import Supporters from "./details/supporters";

export default function WalkDetailPage({ params }: { params: { id: string } }) {
  const { post, loading, fetchPost } = usePostContext();

  useEffect(() => {
    fetchPost(params.id);
  }, [params.id, fetchPost]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="grid grid-cols-2 w-full h-[500px] max-w-[1400px] rounded-xl p-5 m-5 drop-shadow-lg bg-white gap-5">
        <ImagePreview />
        <InfoBar />
      </div>
      <div className="flex w-full min:h-[500px] max-w-[1400px] rounded-xl p-5 m-5 drop-shadow-lg bg-white">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="flex mx-auto w-fit">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="supporters">Supporters</TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <About />
          </TabsContent>
          <TabsContent value="updates" className="w-full divide-y space-y-5">
            <Updates />
          </TabsContent>
          <TabsContent
            value="supporters"
            className="mx-auto grid grid-cols-12 justify-center items-center gap-5"
          >
            <Supporters />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
