"use client";

import PostList from "@/components/sections/landing/postList";

export default function DynamicPage({
  params,
}: {
  params: { title?: string; category?: string };
}) {
  return <PostList params={params} />;
}
