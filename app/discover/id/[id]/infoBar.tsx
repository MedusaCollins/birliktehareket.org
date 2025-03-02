import {
  ChevronsDown,
  Clock,
  Flag,
  MapPin,
  Share2Icon,
  UsersRound,
  EllipsisVertical,
  PencilLine,
  Trash,
  Bookmark,
} from "lucide-react";
import ProgressBar from "@/components/ui/(blocks)/progressBar";
import formatPeople from "@/lib/helpers/formatPeople";
import { Button } from "@/components/ui/button";
import calculateDaysLeft from "@/lib/helpers/calculateDaysLeft";
import { usePostContext } from "@/context/PostContext";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Post } from "@/lib/types";
import ShareDialog from "./shareDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InfoBar() {
  const { post, deletePost } = usePostContext();

  const [isSaved, setIsSaved] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userInfo } = useAuth();
  const { toast } = useToast();
  const walkId = post?._id?.toString();

  useEffect(() => {
    if (userInfo) {
      setIsSaved(userInfo.walkDetails.savedWalk.some((walk) => walk._id.toString() === walkId));
      setIsAttended(
        userInfo.walkDetails.supportedWalk.some((walk) => walk._id.toString() === walkId)
      );
    }
  }, [userInfo, walkId]);

  const handleAction = useCallback(
    async (actionType: "save" | "attend", stateUpdate: (value: boolean) => void) => {
      if (!userInfo) {
        toast({
          title: "Oops!",
          description: `You must be logged in to ${
            actionType === "save" ? "save" : "join"
          } a walk.`,
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      try {
        const res = await axios.post(`/api/posts/${actionType}`, {
          userId: userInfo.id,
          walkId,
        });

        const key = actionType === "save" ? "savedWalk" : "supportedWalk";
        const dataKey = actionType === "save" ? "walk" : "attendedUser";

        if (res.data[dataKey]) {
          userInfo.walkDetails[key] = [
            ...userInfo.walkDetails[key],
            { _id: res.data[dataKey] } as Post,
          ];
        } else {
          userInfo.walkDetails[key] = userInfo.walkDetails[key].filter(
            (walk) => walk._id.toString() !== walkId
          );
        }

        stateUpdate(actionType === "save" ? res.data.walk : res.data.attendedUser);
      } catch (error) {
        toast({
          title: "Oops!",
          description: `An error occurred while ${
            actionType === "save" ? "saving" : "joining"
          } the walk. ${error}`,
          variant: "destructive",
          duration: 2000,
        });
      }
    },
    [userInfo, walkId, toast]
  );

  if (!post || !post.postInfo) return null;
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between">
        <div className="flex justify-center items-center space-x-5 truncate">
          <Link href={`/profile/${post.postInfo.createdBy.userId}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={post.postInfo.createdBy.userImage} className="object-cover" />
              <AvatarFallback className="text-sm font-semibold">
                {post.postInfo.createdBy.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="font-medium flex flex-col justify-start -mt-2 truncate">
            <Link href={`/profile/${post.postInfo.createdBy.userId}`}>
              <span className="text-lg hover:cursor-pointer w-fit">
                {post.postInfo.createdBy.username}
              </span>
            </Link>
            <span className="text-green-600 font-semibold">
              {post.postInfo.createdBy.ownWalkCount} yürüyüş düzenledi
            </span>
          </div>
        </div>
        <div>
          <span className="text-sm text-slate-600 truncate flex items-center">
            <Button variant="ghost" size="sm" onClick={() => handleAction("save", setIsSaved)}>
              <Bookmark className={isSaved ? "fill-slate-700" : ""} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsDialogOpen(!isDialogOpen)}>
              <Share2Icon />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => console.log("Raporla")}>
              <Flag />
            </Button>
            {(userInfo?.id === post.postInfo.createdBy.userId ||
              post.moderators.some((m) => m.userId === userInfo?.id)) && (
              <Button variant="ghost" size="sm" onClick={() => console.log("Dropout")}>
                <DropdownMenu>
                  <div className="flex items-center gap-2">
                    <DropdownMenuTrigger asChild>
                      <Link href={`/discover/id/${post._id}/edit`}>
                        <EllipsisVertical />
                      </Link>
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent className="w-fit mt-3 flex flex-col p-2">
                    <DropdownMenuItem>
                      <Link
                        href={`/discover/id/${post._id}/edit`}
                        className="flex items-center space-x-3 p-2 font-semibold"
                      >
                        <PencilLine />
                        <span>Yürüyüşü Düzenle</span>
                      </Link>
                    </DropdownMenuItem>
                    {userInfo?.id === post.postInfo.createdBy.userId && (
                      <DropdownMenuItem onClick={() => deletePost(post._id.toString())}>
                        <div className="flex items-center space-x-3 p-2 text-red-500 font-semibold">
                          <Trash />
                          <span>Yürüyüşü Sil</span>
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </Button>
            )}
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
              <span className="text-xl font-bold">
                {formatPeople(post.supporters?.length || 0)} kişi
              </span>
              <span>Toplam Katılan</span>
            </span>
          </p>
        </div>
        <div>
          <p className="text-slate-600 truncate flex space-x-2">
            <Clock className="w-6 h-6 text-slate-500 my-1" />
            <span className="flex flex-col">
              <span className="text-xl font-bold">
                {calculateDaysLeft(new Date(post.detail.startDate))}
              </span>
              <span>gün kaldı</span>
            </span>
          </p>
        </div>
        <div className="w-1/3">
          <Button
            className="font-semibold text-base w-full"
            variant={isAttended ? "destructive" : "default"}
            size="lg"
            onClick={() => handleAction("attend", setIsAttended)}
          >
            {isAttended ? "Bu yürüyüşden ayrıl" : "Bu yürüyüşe katıl"}
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
      <ShareDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(!isDialogOpen)}
        url={`https://birliktehareket.org/discover/id/${post._id.toString()}`}
      />
    </div>
  );
}
