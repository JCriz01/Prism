"use client";

import { ChevronLeft, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface MembersListProps {
  onBackClick: () => void;
}

export function MembersList({ onBackClick }: MembersListProps) {
  const members = [
    { id: "1", name: "Jane", status: "online", role: "admin", avatar: "👩" },
    {
      id: "2",
      name: "John",
      status: "online",
      role: "moderator",
      avatar: "👨",
    },
    { id: "3", name: "Sarah", status: "idle", role: "member", avatar: "👧" },
    { id: "4", name: "Mike", status: "dnd", role: "member", avatar: "👦" },
    { id: "5", name: "Alex", status: "offline", role: "member", avatar: "🧑" },
    { id: "6", name: "Emma", status: "online", role: "member", avatar: "👱‍♀️" },
    { id: "7", name: "Tom", status: "online", role: "member", avatar: "👴" },
    { id: "8", name: "Lisa", status: "idle", role: "member", avatar: "👵" },
    { id: "9", name: "David", status: "offline", role: "member", avatar: "🧔" },
    { id: "10", name: "Olivia", status: "dnd", role: "member", avatar: "👩‍🦰" },
  ];

  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  const roleColors = {
    admin: "text-red-400",
    moderator: "text-blue-400",
    member: "text-gray-400",
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header for mobile */}
      <div className="h-12 border-b border-[#1e1f22] flex md:hidden items-center px-4 shadow-sm">
        <button onClick={onBackClick} className="mr-2">
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-semibold text-white">Members</h2>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search members"
            className="bg-[#1e1f22] border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 pl-8"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Role categories */}
      <ScrollArea className="flex-1">
        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">
            ADMIN — 1
          </h3>
          {members
            .filter((member) => member.role === "admin")
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 py-1 px-2 hover:bg-[#35373c] rounded group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
                    <span>{member.avatar}</span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusColors[member.status as keyof typeof statusColors]}`}
                  ></div>
                </div>
                <span
                  className={roleColors[member.role as keyof typeof roleColors]}
                >
                  {member.name}
                </span>
              </div>
            ))}
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">
            MODERATORS — 1
          </h3>
          {members
            .filter((member) => member.role === "moderator")
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 py-1 px-2 hover:bg-[#35373c] rounded group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
                    <span>{member.avatar}</span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusColors[member.status as keyof typeof statusColors]}`}
                  ></div>
                </div>
                <span
                  className={roleColors[member.role as keyof typeof roleColors]}
                >
                  {member.name}
                </span>
              </div>
            ))}
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">
            ONLINE — 4
          </h3>
          {members
            .filter(
              (member) => member.status === "online" && member.role === "member"
            )
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 py-1 px-2 hover:bg-[#35373c] rounded group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
                    <span>{member.avatar}</span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusColors[member.status as keyof typeof statusColors]}`}
                  ></div>
                </div>
                <span className="text-gray-300">{member.name}</span>
              </div>
            ))}
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">IDLE — 2</h3>
          {members
            .filter(
              (member) => member.status === "idle" && member.role === "member"
            )
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 py-1 px-2 hover:bg-[#35373c] rounded group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
                    <span>{member.avatar}</span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusColors[member.status as keyof typeof statusColors]}`}
                  ></div>
                </div>
                <span className="text-gray-300">{member.name}</span>
              </div>
            ))}
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">
            DO NOT DISTURB — 1
          </h3>
          {members
            .filter(
              (member) => member.status === "dnd" && member.role === "member"
            )
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 py-1 px-2 hover:bg-[#35373c] rounded group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
                    <span>{member.avatar}</span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusColors[member.status as keyof typeof statusColors]}`}
                  ></div>
                </div>
                <span className="text-gray-300">{member.name}</span>
              </div>
            ))}
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-gray-400 mb-2">
            OFFLINE — 2
          </h3>
          {members
            .filter(
              (member) =>
                member.status === "offline" && member.role === "member"
            )
            .map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 py-1 px-2 hover:bg-[#35373c] rounded group"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center">
                    <span>{member.avatar}</span>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${statusColors[member.status as keyof typeof statusColors]}`}
                  ></div>
                </div>
                <span className="text-gray-300">{member.name}</span>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
