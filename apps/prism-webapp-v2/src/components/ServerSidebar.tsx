import { useState } from "react";
import { Plus, Hash, Volume2, Settings, Crown } from "lucide-react";
import { UserAccount } from "./UserAccount";
import {
  Link,
  useMatch,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { LoadingFallback } from "./LoadingFallback";

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

export function ServerSidebar({
  selectedServer,
  onServerSelect,
  onChannelSelect,
}: ServerSidebarProps) {
  const user = useUserStore((state) => state.user);

  const serverData = useQuery({
    queryKey: ["servers"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5200/api/server/list", {
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

  console.log("Running ServerSidebar: user>", user);
  console.log("Running ServerSidebar: serverData>", serverData);

  const { spectrumId } = useParams({ strict: false });
  const { channelId } = useParams({ strict: false });

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

  if (serverData.data) {
  }

  return (
    <nav aria-label="Servers" className="w-60 bg-[#2f3136] flex flex-col">
      <h1 className="self-center">
        <Link to="/spectrums">Prism</Link>
      </h1>

      {/* Server List */}
      {serverData.isLoading && (
        <div className="flex-1 p-3 space-y-2 self-center">
          Loading servers...
        </div>
      )}
      {serverData.data && (
        <ul className="flex-1 p-3 space-y-2">
          {serverData.data.servers.map((serverObj) => {
            const expanded = spectrumId === serverObj.spectrumId;
            return (
              <li key={serverObj.spectrumId} className="space-y-1">
                {/* Server Header */}
                <div
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#40444b] transition-colors ${
                    expanded ? "bg-[#40444b]" : ""
                  }`}
                  onClick={() => handleServerClick(serverObj.spectrumId)}
                >
                  <Link
                    className="flex items-center space-x-2 flex-1 block"
                    to={`/spectrums/${serverObj.spectrumId}`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center text-white font-bold">
                        {serverObj.spectrum.iconUrl}
                      </div>
                      <span className="font-medium">
                        {serverObj.spectrum.name}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleServer(serverObj.spectrumId);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      {expanded ? "▼" : "▶"}
                    </button>
                  </Link>
                </div>

                {/* Channels */}
                {expanded && (
                  <ul role="group" className="ml-6 space-y-1">
                    {serverObj.spectrum.channels?.map((channel) => {
                      const active = channelId == channel.id;
                      return (
                        <li
                          key={channel.id}
                          onClick={() => onChannelSelect(channel.id)}
                        >
                          <Link
                            className="flex items-center space-x-2 p-2 rounded-md cursor-pointer hover:bg-[#40444b] transition-colors"
                            to={`/spectrums/${serverObj.id}/${channel.id}`}
                          >
                            {channel.type === "text" ? (
                              <Hash className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-300">
                              {channel.name}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Add Server Button */}
      <div className="p-3">
        <button className="w-full p-2 bg-[#40444b] hover:bg-[#4f545c] rounded-md transition-colors flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span className="text-sm">Add Server</span>
        </button>
      </div>
      <UserAccount />
    </nav>
  );
}
