import { useState, useEffect } from "react";
import { fetchPosts } from "@/lib/services/postService";
import { Post, PostList } from "@/lib/types";

const usePostHandler = ({
  title,
  category,
}: {
  title?: string;
  category?: string;
}) => {
  const [posts, setPosts] = useState<PostList[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [isMoreAvailable, setIsMoreAvailable] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
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
      const response = await fetchPosts(
        pageCount,
        5,
        `${title ? "title=" + title : category ? "subject=" + category : "subject=categorized"}`,
      );
      const filteredResponse = response.data.filter(
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

      const totalPostCount = filteredResponse.reduce(
        (total: number, group: { posts: Post[] }) => total + group.posts.length,
        0,
      );
      setIsMoreAvailable(filteredResponse.length > 0);
      setPosts((prevPosts) => [...prevPosts, ...filteredResponse]);
      setTotalItems((prevTotalItems) => prevTotalItems + totalPostCount);
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
    totalItems,
    isMoreAvailable,
    isLoading,
    setPageCount,
    fetchAndSetPosts,
  };
};

export default usePostHandler;
