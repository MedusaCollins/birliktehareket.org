import calculateDaysLeft from "@/lib/helpers/calculateDaysLeft";
import formatPeople from "@/lib/helpers/formatPeople";
import { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import ProgressBar from "./progressBar";

interface PostCardProps {
  post: Post;
  isLarge?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Link
      href={`/discover/id/${post.id}`}
      className="flex flex-col space-y-3 hover:bg-gray-100/50 transition-all cursor-pointer p-4 rounded-md group h-fit w-[310px]"
    >
      <div className="relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300 aspect-video">
        <Image
          src={post.images[0]}
          alt="post-image"
          width={520}
          height={10}
          className="object-cover w-full h-full"
        />
        <ProgressBar post={post} />
      </div>

      <div className="space-y-3">
        <h1 className="text-lg font-semibold text-slate-800 truncate">
          {post.title}
        </h1>

        <h3 className="text-sm font-medium text-slate-600 truncate">
          {post.organizer}
        </h3>

        <p className="text-xs text-slate-600">
          {formatPeople(post.supporters?.length || 0)} kişi bu yürüyüşü
          katılıyor!
        </p>

        <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span className="truncate">
              {post.detail.location.start} - {post.detail.location.end}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>{`${calculateDaysLeft(post.detail.date)} gün kaldı`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
