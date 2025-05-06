"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Hash, Volume2, Settings, UserPlus, Users } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: {
    id: string;
    name: string;
    initial: string;
    description?: string;
  } | null;
  setIsModalOpen: (isOpen: boolean) => void;
}

export function ServerModal({
  isOpen,
  onClose,
  setIsModalOpen,
}: ServerModalProps) {
  //if (!server) return null;

  const textChannels = [
    { id: "1", name: "general" },
    { id: "2", name: "welcome" },
    { id: "3", name: "announcements" },
  ];

  const voiceChannels = [
    { id: "1", name: "General" },
    { id: "2", name: "Gaming" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#313338] text-gray-100 border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Join a Server
          </DialogTitle>
        </DialogHeader>

        <Separator className="bg-gray-700" />
        <Label>Server Name</Label>
        <Input placeholder="Name of Server"></Input>
        <Button onClick={() => setIsModalOpen(false)}>Join Server</Button>
      </DialogContent>
    </Dialog>
  );
}
