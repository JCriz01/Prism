"use client";

import {
  ChevronDown,
  Hash,
  Volume2,
  Settings,
  Plus,
  Headphones,
  Mic,
  User,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChannelSidebarProps {
  onChannelClick: () => void;
}

export function ChannelSidebar({ onChannelClick }: ChannelSidebarProps) {
  const textChannels = [
    { id: "1", name: "general" },
    { id: "2", name: "welcome" },
    { id: "3", name: "announcements" },
    { id: "4", name: "off-topic" },
    { id: "5", name: "memes" },
  ];

  const voiceChannels = [
    { id: "1", name: "General" },
    { id: "2", name: "Gaming" },
    { id: "3", name: "Music" },
    { id: "4", name: "Chill Zone" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Server header */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm">
        <h2 className="font-semibold text-white flex-1">Discord Clone</h2>
        <button>
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Channels area */}
      <ScrollArea className="flex-1 px-2">
        <div className="mt-4">
          {/* Text channels */}
          <div className="flex items-center justify-between px-1 mb-1">
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-300">
              <ChevronDown size={12} />
              TEXT CHANNELS
            </button>
            <button className="text-gray-400 hover:text-gray-300">
              <Plus size={16} />
            </button>
          </div>

          {textChannels.map((channel) => (
            <button
              key={channel.id}
              className="flex items-center gap-1.5 w-full px-2 py-1 text-gray-400 hover:text-gray-300 hover:bg-[#35373c] rounded group"
              onClick={onChannelClick}
            >
              <Hash size={18} />
              <span className="text-sm">{channel.name}</span>
            </button>
          ))}

          {/* Voice channels */}
          <div className="flex items-center justify-between px-1 mt-4 mb-1">
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-300">
              <ChevronDown size={12} />
              VOICE CHANNELS
            </button>
            <button className="text-gray-400 hover:text-gray-300">
              <Plus size={16} />
            </button>
          </div>

          {voiceChannels.map((channel) => (
            <button
              key={channel.id}
              className="flex items-center gap-1.5 w-full px-2 py-1 text-gray-400 hover:text-gray-300 hover:bg-[#35373c] rounded group"
            >
              <Volume2 size={18} />
              <span className="text-sm">{channel.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* User controls */}
      <div className="h-[52px] bg-[#232428] px-2 flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="text-sm">
            <div className="font-semibold">Username</div>
            <div className="text-xs text-gray-400">#1234</div>
          </div>
        </div>
        <div className="flex gap-1">
          <button className="w-8 h-8 rounded-md hover:bg-[#35373c] flex items-center justify-center">
            <Mic size={18} />
          </button>
          <button className="w-8 h-8 rounded-md hover:bg-[#35373c] flex items-center justify-center">
            <Headphones size={18} />
          </button>
          <button className="w-8 h-8 rounded-md hover:bg-[#35373c] flex items-center justify-center">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
