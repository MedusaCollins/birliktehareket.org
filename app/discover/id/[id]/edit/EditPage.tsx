"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePostContext } from "@/context/PostContext";
import ImagePreview from "../imagePreview";
import Form from "./form";

export default function MainPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { userInfo, loading: userLoading } = useAuth();
  const { post, loading: postLoading, fetchPost } = usePostContext();

  const isModerator = post?.moderators?.some((mod) => mod.userId === userInfo?.id);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id);
    }
  }, [params.id]);

  useEffect(() => {
    if (!isModerator && !postLoading && !userLoading) {
      router.push(`/404`);
    }
  }, [postLoading]);

  if (postLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (!post || !userInfo) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
        Post not found
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="grid grid-cols-2 w-full h-[630px] max-w-[1400px] rounded-xl p-5 m-5 drop-shadow-lg bg-white gap-5">
        <ImagePreview />
        <Form post={post} walkId={params.id} userId={userInfo?.id} />
      </div>
    </div>
  );
}
