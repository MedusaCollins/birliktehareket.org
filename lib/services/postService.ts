import axios from "axios";

export const fetchPosts = async (
  page: number,
  limit: number,
  subject: string,
) => {
  const response = await axios.get(
    `/api/posts?page=${page}&limit=${limit - 1}&subject=${subject}`,
  );
  return response.data.data;
};
