import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface UpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  updateTitle: string;
  updateMessage: string;
  setUpdateTitle: (value: string) => void;
  setUpdateMessage: (value: string) => void;
  onSubmit: () => void;
}

export default function UpdateDialog({
  isOpen,
  onClose,
  updateTitle,
  updateMessage,
  setUpdateTitle,
  setUpdateMessage,
  onSubmit,
}: UpdateDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Güncelleme Bilgileri</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <Input
            className="text-xl"
            type="text"
            placeholder="Güncelleme Başlığı"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          <textarea
            className="w-full h-20 max-h-32 min-h-10 border-2 p-1.5 pl-3 rounded-lg"
            placeholder="Güncelleme Açıklaması"
            value={updateMessage}
            onChange={(e) => setUpdateMessage(e.target.value)}
          />
          <Button onClick={onSubmit}>Güncelle</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
