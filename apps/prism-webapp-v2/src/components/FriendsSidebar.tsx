import { useState } from "react";
import {
  X,
  Circle,
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FriendsSidebarProps {
  onClose: () => void;
}

interface Friend {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  isTyping?: boolean;
}

const getStatusColor = (status: Friend["status"]) => {
  switch (status) {
    case "online":
      return "text-green-400";
    case "idle":
      return "text-yellow-400";
    case "dnd":
      return "text-red-400";
    case "offline":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
};

const getStatusIcon = (status: Friend["status"]) => {
  switch (status) {
    case "online":
      return <Circle className="w-3 h-3 fill-current" />;
    case "idle":
      return <Circle className="w-3 h-3 fill-current" />;
    case "dnd":
      return <Circle className="w-3 h-3 fill-current" />;
    case "offline":
      return <Circle className="w-3 h-3" />;
    default:
      return <Circle className="w-3 h-3" />;
  }
};

export function FriendsSidebar({ onClose }: FriendsSidebarProps) {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const friendData = useQuery({
    queryKey: ["friend"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5200/api/users/friends/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        });
        return res.json();
      } catch (error) {
        console.error("Error fetching server data:", error);
        return null;
      }
    },
  });

  return (
    <div className="w-80 bg-[#2f3136] flex flex-col border-l border-[#202225] h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#202225]">
        <h2 className="text-lg font-semibold">Friends</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#40444b] rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto">
        {friendData.isLoading && (
          <div className="p-3 self-center">Loading friends...</div>
        )}
        {friendData.data &&
          friendData.data.friends.map((friendObj) => (
            <div
              key={friendObj.id}
              className={`p-3 hover:bg-[#40444b] transition-colors cursor-pointer ${
                selectedFriend === friendObj.friend.id ? "bg-[#40444b]" : ""
              }`}
              onClick={() => setSelectedFriend(friendObj.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-lg">
                      {friendObj.friend.avatarUrl}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friendObj.friend.status)}`}
                    >
                      {/* add status icon */}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-white">
                      {friendObj.friend.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      @{friendObj.friend.username}
                    </span>
                    {friendObj.friend.isTyping && (
                      <span className="text-sm text-green-400">typing...</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button className="p-1 hover:bg-[#4f545c] rounded-md transition-colors">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-[#4f545c] rounded-md transition-colors">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-[#4f545c] rounded-md transition-colors">
                    <Video className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-[#4f545c] rounded-md transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Friend Button */}
      <div className="p-4 border-t border-[#202225]">
        <button className="w-full p-2 bg-[#5865f2] hover:bg-[#4752c4] rounded-md transition-colors text-white font-medium">
          Add Friend
        </button>
      </div>
    </div>
  );
}
