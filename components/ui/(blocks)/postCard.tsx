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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const currentSupporters = post.supporters?.length || 0;
  const minimumExpectation = post.detail.minimumPeopleExpectation;

  const width =
    minimumExpectation > 0
      ? `${Math.min((currentSupporters / minimumExpectation) * 100, 100)}%`
      : "0%";

  {
    /* TODO: Change link to walk detail page and little bit of design. */
  }
  return (
    <Link
      href="/"
      className="flex flex-col space-y-3 hover:bg-slate-200/30 transition-all cursor-pointer p-5 rounded-md group h-fit w-[287px]"
    >
      <Image
        src={post.images[0]}
        alt="post-image"
        width={520}
        height={10}
        className="rounded-xl transition-all group-hover:scale-105"
      />

      <div className="space-y-2">
        <h1 className="text-lg font-semibold overflow-hidden truncate whitespace-nowrap">
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
          {`${formatPeople(post.supporters?.length || 0)} kişi bu yürüyüşü destekliyor!`}
        </p>
      </div>
    </Link>
  );
};

export default PostCard;
