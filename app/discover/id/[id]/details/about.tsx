import { usePostContext } from "@/context/PostContext";
import React from "react";

const About = () => {
  const { post } = usePostContext();
  if (!post) return null;

  return <article className="prose prose-xl">{post.description}</article>;
};

export default About;
