import axios from "axios";

export const fetchPosts = async (
  page: number,
  limit: number,
  queryParam: string,
) => {
  const response = await axios.get(
    `/api/posts?page=${page}&limit=${limit}&${queryParam}`,
  );
  return response.data;
};
