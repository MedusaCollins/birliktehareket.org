"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { Post, PostContextType } from "@/lib/types";

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [post, setPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const fetchPost = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/posts/${id}`);
      if (response.data.success) {
        setPost(response.data.data);
        setSelectedImage(response.data.data.images[0]);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PostContext.Provider
      value={{
        post,
        loading,
        selectedImage,
        setSelectedImage,
        fetchPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
