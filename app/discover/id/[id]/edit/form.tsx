import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilLine, Clock, MapPin, ChevronsDown } from "lucide-react";
import { Post, PostUpdate } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import ModeratorDialog from "./moderator/moderatorDialog";
import { useRouter } from "next/navigation";
import UpdateDialog from "./updateDialog";

export default function Form({
  post,
  walkId,
  userId,
}: {
  post: Post;
  walkId: string;
  userId: string;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [updateDialog, setUpdateDialog] = useState(false);
  const [moderatorDialog, setModeratorDialog] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [addedModerators, setAddedModerators] = useState<string[]>([]);
  const [removedModerators, setRemovedModerators] = useState<string[]>([]);
  const [editableFields, setEditableFields] = useState({
    title: false,
    description: false,
    startDate: false,
    locationStart: false,
    locationEnd: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PostUpdate>({
    resolver: zodResolver(PostUpdate),
  });

  const toggleEdit = (field: keyof typeof editableFields) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: PostUpdate) => {
    try {
      const res = await fetch(`/api/posts/update/${walkId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
          updateTitle,
          updateMessage,
          addedModerators: addedModerators.length > 0 ? addedModerators : [],
          removedModerators: removedModerators.length > 0 ? removedModerators : [],
        }),
      });

      if (res.ok) {
        toast({
          description: "Post updated successfully",
          variant: "default",
          duration: 2000,
        });
        router.push(`/discover/id/${walkId}`);
      } else {
        const nextRes = await res.json();
        toast({
          description: nextRes.message,
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (err) {
      toast({
        description: "something went wrong",
        variant: "destructive",
        duration: 2000,
      });
      console.log("Error submitting form:", err);
    }
  };

  useEffect(() => {
    if (post) {
      setValue("title", post.title);
      setValue("description", post.description);
      setValue("detail.startDate", post.detail.startDate);
      setValue("detail.location.start", post.detail.location.start);
      setValue("detail.location.end", post.detail.location.end);
      setValue("moderators", post.moderators);
    }
  }, [post]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full w-full flex flex-col space-y-7">
      <div className="h-full w-full flex flex-col space-y-7">
        <div className="flex justify-between">
          <div className="flex justify-center items-center space-x-5 truncate">
            <Link href={`/profile/${post.postInfo?.createdBy.userId}`}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.postInfo?.createdBy.userImage} className="object-cover" />
                <AvatarFallback className="text-sm font-semibold">
                  {post.postInfo?.createdBy.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="font-medium flex flex-col justify-start -mt-2 truncate">
              <Link href={`/profile/${post.postInfo?.createdBy.userId}`}>
                <span className="text-lg hover:cursor-pointer w-fit">
                  {post.postInfo?.createdBy.username}
                </span>
              </Link>
              <span className="text-green-600 font-semibold">
                {post.postInfo?.createdBy.ownWalkCount} yürüyüş düzenledi
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex items-center gap-2 transition-colors"
              onClick={() => {
                setModeratorDialog(true);
              }}
            >
              <Shield className="size-5 text-blue-600" />
              <span className="font-medium">Moderatörleri Yönet</span>
            </Button>
          </div>
        </div>

        <div className="my-10 space-y-6">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                className="w-fit text-3xl font-semibold p-6 pl-1.5 border-2 rounded-lg"
                disabled={!editableFields.title}
                {...register("title")}
              />
              <Button
                type="button"
                className="size-12"
                variant="ghost"
                size="icon"
                onClick={() => toggleEdit("title")}
              >
                <PencilLine className={editableFields.title ? "fill-gray-400" : ""} />
              </Button>
            </div>
            {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <textarea
                className="w-full h-20 max-h-32 min-h-10 border-2 p-1.5 rounded-lg disabled:text-gray-500"
                disabled={!editableFields.description}
                {...register("description")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => toggleEdit("description")}
              >
                <PencilLine className={editableFields.description ? "fill-gray-400" : ""} />
              </Button>
            </div>
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description.message}</span>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-slate-600 truncate flex space-x-2 justify-center items-center">
            <Clock className="size-7 text-slate-500 my-1" />
            <Input
              type="date"
              className="w-fit text-xl font-bold p-1.5 border-2 rounded-lg"
              disabled={!editableFields.startDate}
              {...register("detail.startDate")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => toggleEdit("startDate")}
              className="size-12"
            >
              <PencilLine className={editableFields.startDate ? "fill-gray-400" : ""} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col bg-slate-100 rounded-md p-2 items-start justify-between h-full pt-2 mt-5 border border-slate-200">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="size-6 text-red-500" />
              <Input
                type="text"
                className="w-fit p-1.5 rounded-md"
                disabled={!editableFields.locationStart}
                {...register("detail.location.start")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleEdit("locationStart")}
                className="size-12"
              >
                <PencilLine className={editableFields.locationStart ? "fill-gray-400" : ""} />
              </Button>
            </div>
            {errors.detail?.location?.start && (
              <span className="text-red-500 text-sm">{errors.detail.location.start.message}</span>
            )}
          </div>

          <ChevronsDown className="size-6 text-slate-500" />

          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <MapPin className="size-6 text-green-500" />
              <Input
                type="text"
                className="w-fit p-1.5 rounded-md"
                disabled={!editableFields.locationEnd}
                {...register("detail.location.end")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleEdit("locationEnd")}
                className="size-12"
              >
                <PencilLine className={editableFields.locationEnd ? "fill-gray-400" : ""} />
              </Button>
            </div>
            {errors.detail?.location?.end && (
              <span className="text-red-500 text-sm">{errors.detail.location.end.message}</span>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center w-full col-start-2">
          <Button type="button" onClick={() => setUpdateDialog(true)}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </div>
      <UpdateDialog
        isOpen={updateDialog}
        onClose={() => setUpdateDialog(false)}
        updateTitle={updateTitle}
        updateMessage={updateMessage}
        setUpdateTitle={setUpdateTitle}
        setUpdateMessage={setUpdateMessage}
        onSubmit={handleSubmit(onSubmit)}
      />

      <ModeratorDialog
        isOpen={moderatorDialog}
        onClose={() => setModeratorDialog(false)}
        post={post}
        onUpdate={(added, removed) => {
          setAddedModerators(added);
          setRemovedModerators(removed);
        }}
      />
    </form>
  );
}
