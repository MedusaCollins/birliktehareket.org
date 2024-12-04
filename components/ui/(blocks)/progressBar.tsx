import { Post } from "@/lib/types";

export default function ProgressBar({
  post,
  basic,
}: {
  post: Post;
  basic?: boolean;
}) {
  const currentSupporters = post.supporters?.length || 0;
  const minimumExpectation = post.detail.minimumPeopleExpectation;

  const width =
    minimumExpectation > 0
      ? `${Math.min((currentSupporters / minimumExpectation) * 100, 100)}%`
      : "0%";

  return (
    <div
      className={`bg-gray-300 overflow-hidden ${basic ? "rounded-b-lg" : "rounded-full"}`}
    >
      <div
        className={`bg-green-600 h-2 ${!basic && "rounded-full"}`}
        style={{ width }}
      />
    </div>
  );
}
