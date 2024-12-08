"use client";

import FilteredType from "@/components/sections/landing/filter/FilteredType";
import Loading from "@/components/ui/(blocks)/loading";
import PostCard from "@/components/ui/(blocks)/postCard";
import { Button } from "@/components/ui/button";
import usePostHandler from "@/hooks/usePostHandler";

export default function DynamicPage({
  params,
}: {
  params: { title?: string; category?: string };
}) {
  const {
    posts,
    filteredPosts,
    filtered,
    categories,
    handleFilterChange,
    isMoreAvailable,
    isLoading,
    totalItems,
    setPageCount,
  } = usePostHandler({
    title: params.title,
    category: params.category,
  });

  return (
    <div className="flex justify-center items-center p-4 bg-white mt-10">
      <div className="space-y-8 w-full max-w-[1400px]">
        {posts.length < 1 ? (
          <div className="pt-4 flex justify-center">
            <Loading loading={true} />
          </div>
        ) : (
          <>
            <div className="flex justify-between max-w-[1300px] mx-auto">
              <div className="text-xl font-medium text-slate-700">
                <span className="text-green-500">{params.title}</span> ile
                alakalı <span className="text-green-500">{totalItems}</span>{" "}
                yürüyüş listelendi
              </div>

              <FilteredType
                placeholder="Kategori Ara..."
                lists={categories}
                value={filtered}
                onChange={handleFilterChange}
              />
            </div>
            {isLoading ? (
              <div className="flex flex-col justify-center">
                <Loading loading={true} />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-5">
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 overflow-hidden">
                  {filteredPosts.map((subject) =>
                    subject.posts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        subject={subject.subject}
                      />
                    )),
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPageCount((prev) => prev + 1)}
                  disabled={!isMoreAvailable}
                >
                  Daha Fazla Göster
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
