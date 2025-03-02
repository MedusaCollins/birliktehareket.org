"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { FaReddit, FaWhatsapp, FaTwitter } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export default function ShareDialog({ isOpen, onClose, url }: ShareDialogProps) {
  const { toast } = useToast();

  const title = "Bu Yürüyüşü Destekliyorum!";
  const shareButtons = [
    {
      name: "X (Twitter)",
      icon: <FaTwitter className="h-5 w-5" />,
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Reddit",
      icon: <FaReddit className="h-5 w-5" />,
      onClick: () => {
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${title}`,
          "_blank"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="h-5 w-5" />,
      onClick: () => {
        const isMobile =
          /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768;
        const whatsappUrl = isMobile
          ? `whatsapp://send?text=${encodeURIComponent(`${title} ${url}`)}`
          : `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`;
        window.open(whatsappUrl, "_blank");
      },
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "Link copied to clipboard!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: `Failed to copy link. ${error}`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this content</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-4">
            {shareButtons.map((button) => (
              <Button
                key={button.name}
                variant="outline"
                size="icon"
                onClick={button.onClick}
                title={button.name}
              >
                {button.icon}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={url}
                readOnly
              />
            </div>
            <Button type="submit" size="icon" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
