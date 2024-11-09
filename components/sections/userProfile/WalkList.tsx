import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import { fakeData } from "@/lib/database/fakeData";
import PostCard from "@/components/ui/(blocks)/postCard";
import { Button } from "@/components/ui/button";

interface WalkListProps {
  walkIds: number[];
  title: string;
}

const WalkList = ({ walkIds, title }: WalkListProps) => {
  const [walkPosts, setWalkPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);

  const postLimit = 6;

  useEffect(() => {
    const filteredPosts = fakeData.filter((post) => walkIds.includes(post.id));
    setWalkPosts(filteredPosts);
    setDisplayedPosts(filteredPosts.slice(0, postLimit));
  }, [walkIds]);

  const loadMorePosts = () => {
    setDisplayedPosts((prevPosts) => [
      ...prevPosts,
      ...walkPosts.slice(page * postLimit, (page + 1) * postLimit),
    ]);
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      {displayedPosts.length > 0 ? (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 place-items-center grid-cols-1 gap-6">
          {displayedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No walks found.</p>
      )}
      {page * postLimit < walkPosts.length && (
        <div className="w-full flex justify-center mt-4">
          <Button
            onClick={loadMorePosts}
            className="px-4 py-2 text-white w-fit rounded-sm mx-auto"
            size="lg"
          >
            Daha Fazla Göster
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalkList;
