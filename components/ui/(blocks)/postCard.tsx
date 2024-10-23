import { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  isLarge?: boolean;
}

function formatPeople(peopleNumber: number) {
  return peopleNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const PostCard: React.FC<PostCardProps> = ({ post, isLarge = false }) => {
  const currentSupporters = post.supporters?.length || 0;
  const minimumExpectation = post.detail.minimumPeopleExpectation;

  const width =
    minimumExpectation > 0
      ? `${Math.min((currentSupporters / minimumExpectation) * 100, 100)}%`
      : "0%";

  {
    /* TODO: Responsive is broken and this design need to be refactored. */
  }

  {
    /* TODO: Change link to walk detail page.. */
  }
  return (
    <Link
      href="/"
      className={`flex flex-col space-y-3 hover:bg-slate-200/30 transition-all cursor-pointer mx-auto p-5 rounded-md group h-fit ${isLarge ? " w-[530px] mr-5" : " w-[287px]"}`}
    >
      <Image
        src={post.images[0]}
        alt="post-image"
        width={isLarge ? 500 : 520}
        height={10}
        className={`rounded-xl transition-all ${isLarge ? "group-hover:scale-[1.02]" : "group-hover:scale-105"}`}
      />

      <div className="space-y-2">
        <h1
          className={`text-${isLarge ? "xl" : "lg"} font-semibold overflow-hidden truncate whitespace-nowrap`}
        >
          {post.title}
        </h1>

        <h3 className="text-sm font-semibold text-slate-700 overflow-hidden truncate whitespace-nowrap">
          {post.organizer}
        </h3>

        <div className="bg-gray-200 rounded-full">
          <div
            className={`bg-green-600 h-2 left-0 rounded-full`}
            style={{ width }}
          />
        </div>

        <p className="text-sm text-slate-700 overflow-hidden truncate whitespace-nowrap">
          {isLarge
            ? post.description
            : `${formatPeople(post.supporters?.length || 0)} kişi bu yürüyüşü destekliyor!`}
        </p>
      </div>
    </Link>
  );
};

export default PostCard;
