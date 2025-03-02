"use client";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Post } from "@/lib/types";
import ManageModerators from "./manageModerators";
import AddModerator from "./addModerator";

interface ModeratorDialogProps {
  isOpen: boolean;
  post: Post;
  onClose: () => void;
  onUpdate: (added: string[], removed: string[]) => void;
}

interface UIMods {
  userId: string;
  date: string;
  username?: string;
  userImage?: string;
}

const ModeratorDialog: React.FC<ModeratorDialogProps> = ({ isOpen, onClose, post, onUpdate }) => {
  const [added, setAdded] = useState<string[]>([]);
  const [removed, setRemoved] = useState<string[]>([]);
  const [moderators, setModerators] = useState<UIMods[]>(post.moderators || []);

  useEffect(() => {
    if (post?.moderators) {
      setModerators(post.moderators);
      setAdded([]);
      setRemoved([]);
    }
  }, [post]);

  useEffect(() => {
    onUpdate(added, removed);
  }, [added, removed]);

  const handleAddModerator = useCallback(
    (id: string, username?: string, userImage?: string) => {
      if (!added.includes(id) && !moderators.some((m) => m.userId === id)) {
        setAdded((prev) => [...prev, id]);
        setModerators((prev) => [
          ...prev,
          {
            userId: id,
            username: username,
            userImage,
            date: new Date().toISOString(),
          },
        ]);
      }
      setRemoved((prev) => prev.filter((r) => r !== id));
    },
    [added, moderators]
  );

  const handleRemoveModerator = useCallback(
    (id: string) => {
      if (!removed.includes(id)) {
        setRemoved((prev) => [...prev, id]);
        setModerators((prev) => prev.filter((m) => m.userId !== id));
      }
      setAdded((prev) => prev.filter((a) => a !== id));
    },
    [removed, moderators]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl max-h-[80vh] overflow-auto p-4">
        <DialogHeader>
          <DialogTitle>Moderatör Yönetimi</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Moderatör Ekle</TabsTrigger>
            <TabsTrigger value="manage">Moderatörleri Yönet ({moderators.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-4">
            <AddModerator moderators={moderators} handleAdd={handleAddModerator} />
          </TabsContent>

          <TabsContent value="manage" className="mt-4">
            <ManageModerators onRemove={handleRemoveModerator} moderators={moderators} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ModeratorDialog;
