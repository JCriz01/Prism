"use client";

import { useState } from "react";
import {
  Hash,
  Bell,
  Pin,
  Users,
  Inbox,
  HelpCircle,
  PlusCircle,
  Gift,
  Sticker,
  GiftIcon as GIF,
  Smile,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ChatAreaProps {
  onMembersClick: () => void;
}

export function ChatArea({ onMembersClick }: ChatAreaProps) {
  const [message, setMessage] = useState("");

  const messages = [
    {
      id: "1",
      author: "Discord Bot",
      avatar: "🤖",
      content: "Welcome to the Discord Clone!",
      timestamp: "Today at 12:00 PM",
    },
    {
      id: "2",
      author: "Jane",
      avatar: "👩",
      content: "Hey everyone! How's it going?",
      timestamp: "Today at 12:05 PM",
    },
    {
      id: "3",
      author: "John",
      avatar: "👨",
      content:
        "Just working on some code. This Discord clone looks pretty good!",
      timestamp: "Today at 12:07 PM",
    },
    {
      id: "4",
      author: "Sarah",
      avatar: "👧",
      content: "Yeah, it's coming along nicely!",
      timestamp: "Today at 12:10 PM",
    },
    {
      id: "5",
      author: "Mike",
      avatar: "👦",
      content: "Has anyone tried the new game that just came out?",
      timestamp: "Today at 12:15 PM",
    },
    {
      id: "6",
      author: "Jane",
      avatar: "👩",
      content: "Not yet, is it any good?",
      timestamp: "Today at 12:18 PM",
    },
    {
      id: "7",
      author: "Mike",
      avatar: "👦",
      content: "It's amazing! We should play together sometime.",
      timestamp: "Today at 12:20 PM",
    },
    {
      id: "8",
      author: "Discord Bot",
      avatar: "🤖",
      content: "Remember to be kind and follow the server rules!",
      timestamp: "Today at 12:30 PM",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Channel header */}
      <div className="h-12 border-b border-[#1e1f22] flex items-center px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Hash size={24} className="text-gray-400" />
          <h2 className="font-semibold text-white">general</h2>
        </div>
        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-600" />
        <span className="text-sm text-gray-400">General chat for everyone</span>

        <div className="ml-auto flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-200">
            <Bell size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-200">
            <Pin size={20} />
          </button>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onMembersClick}
          >
            <Users size={20} />
          </button>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="h-6 bg-[#1e1f22] border-none text-sm w-36 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <button className="text-gray-400 hover:text-gray-200">
            <Inbox size={20} />
          </button>
          <button className="text-gray-400 hover:text-gray-200">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Welcome message */}
          <div className="flex flex-col items-center gap-2 py-8">
            <div className="w-16 h-16 rounded-full bg-[#5865f2] flex items-center justify-center">
              <Hash size={32} className="text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">
              Welcome to #general!
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              This is the start of the #general channel. Send messages, share
              files, and have fun!
            </p>
          </div>

          {/* Messages */}
          {messages.map((msg, index) => (
            <div key={msg.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-[#36393f] flex-shrink-0 flex items-center justify-center">
                <span className="text-xl">{msg.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{msg.author}</span>
                  <span className="text-xs text-gray-400">{msg.timestamp}</span>
                </div>
                <p className="text-gray-100">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="px-4 pb-6">
        <div className="relative">
          <div className="absolute left-4 top-2.5 text-gray-400">
            <PlusCircle size={20} />
          </div>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message #general"
            className="bg-[#383a40] border-none pl-12 pr-24 py-6 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="absolute right-4 top-2.5 flex items-center gap-2 text-gray-400">
            <button className="hover:text-gray-200">
              <Gift size={20} />
            </button>
            <button className="hover:text-gray-200">
              <GIF size={20} />
            </button>
            <button className="hover:text-gray-200">
              <Sticker size={20} />
            </button>
            <button className="hover:text-gray-200">
              <Smile size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
