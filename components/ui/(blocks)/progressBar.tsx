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
    <>
      {basic ? (
        <div className="bg-gray-200 rounded-full">
          <div
            className={`bg-green-600 h-2 left-0 rounded-full`}
            style={{ width }}
          />
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 w-full bg-gray-300 h-2 rounded-b-xl overflow-hidden">
          <div
            className="bg-green-600 h-full rounded-xl transition-all"
            style={{ width }}
          />
        </div>
      )}
    </>
  );
}
