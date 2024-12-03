import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "@/components/ui/(blocks)/postCard";
import { Button } from "@/components/ui/button";
import { Post } from "@/lib/types";

interface WalkListProps {
  walkIds: string[];
  title: string;
}

const WalkList = ({ walkIds, title }: WalkListProps) => {
  const [walkPosts, setWalkPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const postLimit = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/posts", {
          params: {
            ids: walkIds.join(","),
          },
        });
        if (response.data.success) {
          setWalkPosts(response.data.data);
          setDisplayedPosts(response.data.data.slice(0, postLimit));
        } else {
          console.error("Posts not found");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (walkIds.length > 0) {
      fetchPosts();
    }
  }, [walkIds]);

  const loadMorePosts = () => {
    setDisplayedPosts((prevPosts) => [
      ...prevPosts,
      ...walkPosts.slice(page * postLimit, (page + 1) * postLimit),
    ]);
    setPage((prevPage) => prevPage + 1);
  };

  if (loading) {
    return <p className="text-center">Yükleniyor...</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-row justify-between mb-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      {displayedPosts.length > 0 ? (
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 place-items-center grid-cols-1 gap-6">
          {displayedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">Hiç yürüyüş bulunamadı.</p>
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
