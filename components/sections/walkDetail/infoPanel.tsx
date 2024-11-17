import ProgressBar from "@/components/ui/(blocks)/progressBar";
import { Button } from "@/components/ui/button";
import calculateDaysLeft from "@/lib/helpers/calculateDaysLeft";
import formatDate from "@/lib/helpers/formatDate";
import formatPeople from "@/lib/helpers/formatPeople";
import { Post } from "@/lib/types";
import { Share, Bookmark } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function InfoPanel({ post }: { post: Post }) {
  {
    /* TODO: Center area is so empty, add some content here */
  }
  const [isSaved, setIsSaved] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const { saveWalk, attendWalk, userInfo } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userInfo && userInfo.walkDetails.savedWalk.includes(post.id)) {
      setIsSaved(true);
    }
    if (userInfo && userInfo.walkDetails.supportedWalk.includes(post.id)) {
      setIsAttended(true);
    }
  }, [userInfo, post.id]);

  const handleSave = async () => {
    await saveWalk(post.id);
    const isPostSaved = userInfo?.walkDetails.savedWalk.includes(post.id) ?? false;
    setIsSaved(isPostSaved);

    if (!userInfo) {
      toast({
        title: "Oops!",
        description: "You must be logged in to save a walk.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleAttend = async () => {
    await attendWalk(post.id);
    const isPostAttended = userInfo?.walkDetails.supportedWalk.includes(post.id) ?? false;
    setIsAttended(isPostAttended);

    if (!userInfo) {
      toast({
        title: "Oops!",
        description: "You must be logged in to join a walk.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <div className="lg:col-span-1 col-span-3 w-full h-[460px] p-5 rounded-md shadow-xl space-y-2 flex flex-col justify-between">
      <div>
        <ProgressBar post={post} basic={true} />
        <p className="text-lg font-semibold text-slate-700 overflow-hidden truncate whitespace-nowrap">
          {formatPeople(post.supporters?.length || 0)} kişi bu yürüyüşe katılıyor!
        </p>
        <h3 className="text-sm text-slate-700 overflow-hidden truncate whitespace-nowrap">
          <span>Hedeflenen kişi sayısı: </span>
          <span className="font-semibold">
            {formatPeople(post.detail.minimumPeopleExpectation)}
          </span>
        </h3>
      </div>
      <div className="space-y-4">
        {/* TODO: Add functionality to share button */}
        <Button
          className="w-full text-lg"
          variant={isAttended ? "destructive" : "default"}
          size="lg"
          onClick={handleAttend}
        >
          {isAttended ? "Bu yürüyüşden ayrıl" : "Bu yürüyüşe katıl"}
        </Button>
        <div className="flex justify-between">
          <Button
            className="text-sm text-slate-600 flex gap-1"
            variant="outline"
            size="sm"
            onClick={handleSave}
          >
            <Bookmark className={`w-4 h-4 text-slate-500 ${isSaved ? "fill-slate-500" : ""}`} />
            {isSaved ? "Kaydedildi" : "Kaydet"}
          </Button>
          <Button className="text-sm text-slate-600 flex gap-1" variant="outline" size="sm">
            <Share className="w-4 h-4 text-slate-500" />
            Yürüyüşü paylaş
          </Button>
        </div>

        <p className="text-sm text-slate-500 overflow-hidden">
          Bu yürüyüş, <span className="text-slate-800">{formatDate(post.detail.date)}</span> (
          <span className="text-slate-700 italic">{`${calculateDaysLeft(
            post.detail.date
          )} gün kaldı`}</span>
          ) tarihinde hedef katılım sayısına ulaşılırsa yapılacak.
        </p>
      </div>
    </div>
  );
}
