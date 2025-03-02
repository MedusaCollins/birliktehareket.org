import { PostProvider } from "@/context/PostContext";
import MainPage from "./EditPage";

export default function EditPageWrapper({ params }: { params: { id: string } }) {
  return (
    <PostProvider>
      <MainPage params={params} />
    </PostProvider>
  );
}
