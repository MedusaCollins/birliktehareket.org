import ProgressBar from "@/components/ui/(blocks)/progressBar";
import { Button } from "@/components/ui/button";
import calculateDaysLeft from "@/lib/helpers/calculateDaysLeft";
import formatDate from "@/lib/helpers/formatDate";
import formatPeople from "@/lib/helpers/formatPeople";
import { Post } from "@/lib/types";
import { Share, Bookmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export default function InfoPanel({ post }: { post: Post }) {
  {
    /* TODO: Center area is so empty, add some content here */
  }
  const [isSaved, setIsSaved] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const { userInfo } = useAuth();
  const { toast } = useToast();
  const walkId = post._id as string;

  useEffect(() => {
    if (userInfo) {
      setIsSaved(userInfo.walkDetails.savedWalk.includes(walkId));
      setIsAttended(userInfo.walkDetails.supportedWalk.includes(walkId));
    }
  }, [userInfo, walkId]);

  const handleAction = useCallback(
    async (
      actionType: "save" | "attend",
      stateUpdate: (value: boolean) => void,
    ) => {
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

        if (actionType === "save") {
          userInfo.walkDetails.savedWalk = res.data.walk
            ? [...userInfo.walkDetails.savedWalk, walkId]
            : userInfo.walkDetails.savedWalk.filter((id) => id !== walkId);
        } else {
          userInfo.walkDetails.supportedWalk = res.data.attendedUser
            ? [...userInfo.walkDetails.supportedWalk, walkId]
            : userInfo.walkDetails.supportedWalk.filter((id) => id !== walkId);
        }

        stateUpdate(
          actionType === "save" ? res.data.walk : res.data.attendedUser,
        );
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
    [userInfo, walkId, toast],
  );

  return (
    <div className="lg:col-span-1 col-span-3 w-full h-[460px] p-5 rounded-md shadow-xl space-y-2 flex flex-col justify-between">
      <div>
        <ProgressBar post={post} />
        <p className="text-lg font-semibold text-slate-700 overflow-hidden truncate whitespace-nowrap">
          {formatPeople(post.supporters?.length || 0)} kişi bu yürüyüşe
          katılıyor!
        </p>
        <h3 className="text-sm text-slate-700 overflow-hidden truncate whitespace-nowrap">
          <span>Hedeflenen kişi sayısı: </span>
          <span className="font-semibold">
            {formatPeople(post.detail.minimumPeopleExpectation)}
          </span>
        </h3>
      </div>
      <div>
        <p className="font-semibold text-slate-700">Açıklama:</p>
        <p>{post.description}</p>
      </div>
      <div className="space-y-4">
        {/* TODO: Add functionality to share button */}
        <Button
          className="w-full text-lg"
          variant={isAttended ? "destructive" : "default"}
          size="lg"
          onClick={() => handleAction("attend", setIsAttended)}
        >
          {isAttended ? "Bu yürüyüşden ayrıl" : "Bu yürüyüşe katıl"}
        </Button>
        <div className="flex justify-between">
          <Button
            className="text-sm text-slate-600 flex gap-1"
            variant="outline"
            size="sm"
            onClick={() => handleAction("save", setIsSaved)}
          >
            <Bookmark
              className={`w-4 h-4 text-slate-500 ${isSaved ? "fill-slate-500" : ""}`}
            />
            {isSaved ? "Kaydedildi" : "Kaydet"}
          </Button>
          <Button
            className="text-sm text-slate-600 flex gap-1"
            variant="outline"
            size="sm"
          >
            <Share className="w-4 h-4 text-slate-500" />
            Yürüyüşü paylaş
          </Button>
        </div>

        <p className="text-sm text-slate-500 overflow-hidden">
          Bu yürüyüş,{" "}
          <span className="text-slate-800">
            {formatDate(new Date(post.detail.startDate))}
          </span>{" "}
          (
          <span className="text-slate-700 italic">{`${calculateDaysLeft(
            new Date(post.detail.startDate),
          )} gün kaldı`}</span>
          ) tarihinde hedef katılım sayısına ulaşılırsa yapılacak.
        </p>
      </div>
    </div>
  );
}
