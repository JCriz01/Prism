import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ServerSidebar } from "@/components/ServerSidebar";
import { FriendsSidebar } from "@/components/FriendsSidebar";
import { ChatArea } from "@/components/ChatArea";
import { MembersList } from "@/components/MembersList";
import { UserAccount } from "@/components/UserAccount";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { ServerListSidebar } from "@/components/ServerListSidebar";
import { selectedServerAtom } from "@/atoms/selectedServerAtom";
import { useAtom } from "jotai";

export const Route = createFileRoute("/spectrums")({
  component: RouteComponent,
});

//* Application root component.
function RouteComponent() {
  return (
    <ErrorBoundary>
      <SpectrumsApp />
    </ErrorBoundary>
  );
}

function SpectrumsApp() {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [showFriends, setShowFriends] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //* Jotai atoms
  const [selectedServer2, setSelectedServer2] = useAtom(selectedServerAtom);

  //* potentially remove this?
  // Set default server and channel on mount
  useEffect(() => {
    console.log(
      "SpectrumsApp: useEffect running, selectedServer:",
      selectedServer
    );

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    if (!selectedServer) {
      console.log("SpectrumsApp: Setting default server and channel");
      setSelectedServer("1");
      setSelectedChannel("1-1");
    }

    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [selectedServer]);

  // Additional effect to set loading to false after server is set
  useEffect(() => {
    if (selectedServer && selectedChannel) {
      console.log("SpectrumsApp: Server and channel set, stopping loading");
      setIsLoading(false);
    }
  }, [selectedServer, selectedChannel]);

  const handleServerSelect = (serverId: string) => {
    console.log("SpectrumsApp: Server selected:", serverId);
    setSelectedServer(serverId);
    setSelectedServer2(parseInt(serverId));
    // Reset channel when switching servers
    setSelectedChannel(null);
  };

  const handleChannelSelect = (channelId: string) => {
    console.log("SpectrumsApp: Channel selected:", channelId);
    setSelectedChannel(channelId);
  };

  console.log(
    "SpectrumsApp: Rendering, isLoading:",
    isLoading,
    "selectedServer:",
    selectedServer,
    "selectedChannel:",
    selectedChannel
  );

  // Show loading state
  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex h-screen bg-[#36393f] text-white">
      {/* Server Sidebar */}
      <ServerSidebar
        selectedServer={selectedServer}
        onServerSelect={handleServerSelect}
        onChannelSelect={handleChannelSelect}
      />

      <Outlet />
    </div>
  );
}
