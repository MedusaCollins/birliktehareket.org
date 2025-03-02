"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface AddModeratorProps {
  moderators: { userId: string }[];
  handleAdd: (id: string, username?: string, userImage?: string) => void;
}
type ExtendedUser = User & { _id: string };

export default function AddModerator({ moderators, handleAdd }: AddModeratorProps) {
  const moderatorIds = moderators.map((mod) => mod.userId);
  const { users, loading, error, setQuery, query } = useFetchUsers(moderatorIds);

  return (
    <div>
      <div className="relative flex items-center mb-4">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kullanıcı ara..."
            className="w-full p-2 pr-10 border rounded-md"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {loading && (
        <>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2 border-b">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
          ))}
        </>
      )}

      {!loading && users?.length === 0 && query.trim() !== "" && !error && (
        <p className="text-center text-gray-500 my-4">Sonuç bulunamadı</p>
      )}
      {users?.map((user) => {
        const extendedUser = user as ExtendedUser;
        return (
          <div
            key={extendedUser._id}
            className="grid grid-cols-[1fr_1fr_auto] items-center p-2 gap-4 border-b hover:bg-gray-50"
          >
            <Link href={`/profile/${extendedUser._id}`} className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={extendedUser.image} className="object-cover" />
                <AvatarFallback className="text-sm font-semibold">
                  {extendedUser.username?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="truncate max-w-[150px] font-medium">{extendedUser.username}</h3>
                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                  {extendedUser.email || "No email"}
                </p>
              </div>
            </Link>

            <h3 className="text-center font-mono text-sm text-gray-600 truncate">
              {extendedUser._id}
            </h3>

            <Button
              size="icon"
              variant="default"
              onClick={() => handleAdd(extendedUser._id, extendedUser.username, extendedUser.image)}
            >
              <PlusCircle size={20} />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
