import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/services/postService";
import { Post, PostList } from "@/lib/types";

const usePostHandler = () => {
  const [posts, setPosts] = useState<PostList[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [isMoreAvailable, setIsMoreAvailable] = useState(true);
  const [filtered, setFiltered] = useState<string>("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts =
    filtered === ""
      ? posts
      : posts.filter((group) => group.subject === filtered);

  const fetchAndSetPosts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPosts(pageCount, 12, "categorized");
      const filteredResponse = data
        .map((group: { subject: string; posts: Post[] }) => ({
          subject: group.subject,
          posts: group.posts.filter(
            (post) => new Date(post.detail.startDate) > new Date(),
          ),
        }))
        .filter(
          (group: { subject: string; posts: Post[] }) => group.posts.length > 0,
        );

      setCategories((prevCategories) => {
        const newCategories = filteredResponse.map(
          (group: { subject: string }) => ({
            value: group.subject,
            label: group.subject,
          }),
        );

        const mergedCategories = [...prevCategories];

        newCategories.forEach(
          (newCategory: { value: string; label: string }) => {
            const isAlreadyExists = mergedCategories.some(
              (category) => category.value === newCategory.value,
            );
            if (!isAlreadyExists) {
              mergedCategories.push(newCategory);
            }
          },
        );

        return mergedCategories;
      });
      setIsMoreAvailable(filteredResponse.length > 0);
      setPosts((prevPosts) => [...prevPosts, ...filteredResponse]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setFiltered(filter);
      setIsLoading(false);
    }, 200);
  };

  useEffect(() => {
    fetchAndSetPosts();
  }, [pageCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    posts,
    filteredPosts,
    filtered,
    handleFilterChange,
    categories,
    isMoreAvailable,
    isLoading,
    setPageCount,
    fetchAndSetPosts,
  };
};

export default usePostHandler;
