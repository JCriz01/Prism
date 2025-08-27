import { useState } from "react";
import { Plus, Hash, Volume2, Settings, Crown } from "lucide-react";

interface ServerSidebarProps {
  selectedServer: string | null;
  onServerSelect: (serverId: string) => void;
  onChannelSelect: (channelId: string) => void;
}

interface Server {
  id: string;
  name: string;
  icon: string;
  channels: Channel[];
}

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
}

// Mock data - in a real app this would come from an API
const mockServers: Server[] = [
  {
    id: "1",
    name: "Gaming Hub",
    icon: "🎮",
    channels: [
      { id: "1-1", name: "general", type: "text" },
      { id: "1-2", name: "gaming-chat", type: "text" },
      { id: "1-3", name: "voice-chat", type: "voice" },
    ],
  },
  {
    id: "2",
    name: "Study Group",
    icon: "📚",
    channels: [
      { id: "2-1", name: "general", type: "text" },
      { id: "2-2", name: "homework-help", type: "text" },
      { id: "2-3", name: "study-sessions", type: "voice" },
    ],
  },
  {
    id: "3",
    name: "Music Lovers",
    icon: "🎵",
    channels: [
      { id: "3-1", name: "general", type: "text" },
      { id: "3-2", name: "music-chat", type: "text" },
      { id: "3-3", name: "music-room", type: "voice" },
    ],
  },
];

export function ServerListSidebar({
  selectedServer,
  onServerSelect,
  onChannelSelect,
}: ServerSidebarProps) {
  const [expandedServers, setExpandedServers] = useState<Set<string>>(
    new Set(["1"])
  );

  const toggleServer = (serverId: string) => {
    const newExpanded = new Set(expandedServers);
    if (newExpanded.has(serverId)) {
      newExpanded.delete(serverId);
    } else {
      newExpanded.add(serverId);
    }
    setExpandedServers(newExpanded);
  };

  const handleServerClick = (serverId: string) => {
    onServerSelect(serverId);
    if (!expandedServers.has(serverId)) {
      setExpandedServers((prev) => new Set([...prev, serverId]));
    }
  };

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      {/* Server List */}
      <div className="flex-1 p-3 space-y-2">
        {mockServers.map((server) => (
          <div key={server.id} className="space-y-1">
            {/* Server Header */}
            <div
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#40444b] transition-colors ${
                selectedServer === server.id ? "bg-[#40444b]" : ""
              }`}
              onClick={() => handleServerClick(server.id)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center text-white font-bold">
                  {server.icon}
                </div>
                <span className="font-medium">{server.name}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleServer(server.id);
                }}
                className="text-gray-400 hover:text-white"
              >
                {expandedServers.has(server.id) ? "▼" : "▶"}
              </button>
            </div>

            {/* Channels */}
            {expandedServers.has(server.id) && (
              <div className="ml-6 space-y-1">
                {server.channels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-[#40444b] transition-colors"
                    onClick={() => onChannelSelect(channel.id)}
                  >
                    {channel.type === "text" ? (
                      <Hash className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-300">
                      {channel.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Server Button */}
      <div className="p-3">
        <button className="w-full p-2 bg-[#40444b] hover:bg-[#4f545c] rounded-md transition-colors flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span className="text-sm">Add Server</span>
        </button>
      </div>
    </div>
  );
}
