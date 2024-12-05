import calculateDaysLeft from "@/lib/helpers/calculateDaysLeft";
import formatPeople from "@/lib/helpers/formatPeople";
import { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, UsersRound } from "lucide-react";
import ProgressBar from "./progressBar";

interface PostCardProps {
  post: Post;
  subject?: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, subject }) => {
  return (
    <Link
      href={`/discover/id/${post._id}`}
      className="flex flex-col space-y-3 hover:bg-gray-100/50 transition-all cursor-pointer p-4 rounded-md group h-fit w-[310px]"
    >
      <div>
        <Image
          src={post.images[0]}
          alt="post-image"
          width={520}
          height={10}
          className="w-full h-full rounded-lg duration-300"
        />
      </div>

      <div className="space-y-3">
        <div>
          {subject && (
            <h1 className="text-lg font-bold text-green-700 truncate">
              {subject}
            </h1>
          )}

          <h1 className="text-lg font-semibold text-slate-800 truncate">
            {post.title}
          </h1>
        </div>
        <ProgressBar post={post} />

        <h3 className="text-sm font-medium text-slate-600 truncate">
          {post.organizer}
        </h3>

        <p className="text-xs text-slate-600 truncate flex items-center">
          <UsersRound className="w-4 h-4 mr-1 text-slate-500" />
          {formatPeople(post.supporters?.length || 0)} kişi bu yürüyüşe
          katılıyor!
        </p>

        <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
          <div className="flex items-center space-x-1 truncate">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="max-w-[150px] truncate">
              {post.detail.location.start} - {post.detail.location.end}
            </span>
          </div>

          <div className="flex items-center space-x-1 truncate">
            <Clock className="w-4 h-4 text-slate-500" />
            {/* TODO: Implement an "isActive" field in the post object. Once implemented, we can use "isActive" to display statuses like "day left", "ongoing", or "upcoming". */}
            <span>{`${calculateDaysLeft(new Date(post.detail.startDate))} gün kaldı`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
