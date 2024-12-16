import {
  BookMarked,
  ChevronsDown,
  Clock,
  Flag,
  MapPin,
  Share2Icon,
  UsersRound,
} from "lucide-react";
import ProgressBar from "@/components/ui/(blocks)/progressBar";
import formatPeople from "@/lib/helpers/formatPeople";
import { Button } from "@/components/ui/button";
import calculateDaysLeft from "@/lib/helpers/calculateDaysLeft";
import Image from "next/image";
import { usePostContext } from "@/context/PostContext";

export default function InfoBar() {
  const { post } = usePostContext();

  if (!post) return null;

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between">
        <div className="flex justify-center items-center space-x-5 truncate">
          <Image
            src={post.postInfo.createdBy.userImage}
            alt="avatar"
            width={100}
            height={100}
            onClick={() => console.log("kullanıcı profiline git")}
            className="w-12 h-12 rounded-full hover:cursor-pointer"
          />
          <div className="font-medium flex flex-col justify-start -mt-2 truncate">
            <span
              className="text-lg hover:cursor-pointer w-fit"
              onClick={() => console.log("kullanıcı profiline git")}
            >
              {post.postInfo.createdBy.username}
            </span>
            <span className="text-green-600 font-semibold">
              {post.postInfo.createdBy.ownWalkCount} yürüyüş düzenledi
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm text-slate-600 truncate flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("Kaydet")}
            >
              <BookMarked />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("Paylaş")}
            >
              <Share2Icon />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log("Raporla")}
            >
              <Flag />
            </Button>
          </span>
        </div>
      </div>

      <div className="my-10 space-y-6">
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p>{post.description}</p>
        <ProgressBar post={post} />
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-slate-600 truncate flex space-x-2">
            <UsersRound className="w-6 h-6 text-slate-500 my-1" />
            <span className="flex flex-col">
              <p className="text-xl font-bold">
                {formatPeople(post.supporters?.length || 0)} kişi
              </p>
              <p>Toplam Katılan</p>
            </span>
          </p>
        </div>
        <div>
          <p className="text-slate-600 truncate flex space-x-2">
            <Clock className="w-6 h-6 text-slate-500 my-1" />
            <span className="flex flex-col">
              <p className="text-xl font-bold">
                {calculateDaysLeft(new Date(post.detail.startDate))}
              </p>
              <p>gün kaldı</p>
            </span>
          </p>
        </div>
        <div className="w-1/3">
          <Button
            variant="default"
            className="font-semibold text-base w-full"
            onClick={() => console.log("Yürüyüşe Katıl")}
          >
            Yürüyüşe Katıl
          </Button>
        </div>
      </div>
      <div className="flex flex-col bg-slate-100 rounded-md p-2 items-start justify-between h-full pt-2 mt-5 border border-slate-200">
        <div className="flex items-center space-x-2">
          <MapPin className="size-6 text-red-500" />
          <p className="break-all">{post.detail.location.start}</p>
        </div>
        <ChevronsDown className="size-6 text-slate-500" />
        <div className="flex items-center space-x-2">
          <MapPin className="size-6 text-green-500" />
          <span className="break-all">{post.detail.location.end}</span>
        </div>
      </div>
    </div>
  );
}
