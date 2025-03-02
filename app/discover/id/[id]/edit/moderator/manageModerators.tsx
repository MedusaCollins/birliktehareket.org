import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ModeratorManageProps {
  onRemove: (id: string) => void;
  moderators: { userId: string; date: string; userImage?: string; username?: string }[];
}

const ManageModerators: React.FC<ModeratorManageProps> = ({ onRemove, moderators }) => {
  return (
    <>
      {moderators?.map(
        (moderator: { date: string; userId: string; userImage?: string; username?: string }) => {
          return (
            <div
              key={moderator.userId}
              className="grid grid-cols-[1fr_1fr_auto] items-center p-2 gap-4 border-b"
            >
              <Link href={`/profile/${moderator.userId}`} className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={moderator.userImage} className="object-cover" />
                  <AvatarFallback className="text-sm font-semibold">
                    {moderator.username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="truncate max-w-[150px] font-medium">{moderator.username}</h3>
              </Link>

              <h3 className="text-center font-mono text-sm text-gray-600">{moderator.userId}</h3>

              <Button size="icon" variant="destructive" onClick={() => onRemove(moderator.userId)}>
                <Trash size={20} />
              </Button>
            </div>
          );
        }
      )}
    </>
  );
};

export default ManageModerators;
