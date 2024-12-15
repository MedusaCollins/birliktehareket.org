import { PostProvider } from "@/context/PostContext";
import WalkDetailPage from "./WalkDetailPage";

export default function WalkDetailPageWrapper({
  params,
}: {
  params: { id: string };
}) {
  return (
    <PostProvider>
      <WalkDetailPage params={params} />
    </PostProvider>
  );
}
