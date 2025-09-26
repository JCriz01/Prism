import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ServerSidebar } from "@/components/ServerSidebar";
//import { FriendsSidebar } from "@/components/FriendsSidebar";
import { ChatArea } from "@/components/ChatArea";
import { MembersList } from "@/components/MembersList";
//import { UserAccount } from "@/components/UserAccount";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingFallback } from "@/components/LoadingFallback";
import { selectedServerAtom } from "@/atoms/selectedServerAtom";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";

export const Route = createFileRoute("/spectrums")({
  component: RouteComponent,
  beforeLoad: () => {
    const hasToken = !!localStorage.getItem("user-token");
    if (!hasToken) {
      throw redirect({ to: "/auth/login" });
    }

    return;
  },
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

  const setUser = useUserStore((state) => state.updateUser);
  const user = useUserStore((state) => state.user);

  const userData = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch("http://localhost:5200/api/users/session", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        });
        return res.json();
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    },
  });

  if (userData.data) {
    setUser(userData.data);
  }

  console.log("Running root SpectrumsApp: user:", user);

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
    setSelectedServer2(serverId);
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
  if (userData.isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="flex h-screen bg-[#36393f] text-white">
      {/* Server Sidebar */}
      <ServerSidebar
        selectedServer={selectedServer2}
        onServerSelect={handleServerSelect}
        onChannelSelect={handleChannelSelect}
      />
      <Outlet />
    </div>
  );
}
