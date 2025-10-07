import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Message {
  id: string;
  content: string;
  channelId: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
  type: "DEFAULT" | "REPLY" | "SYSTEM";
}

interface Channel {
  id: string;
  name: string;
  type: string;
  spectrum?: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  _count?: {
    messages: number;
  };
}

interface OnlineUser {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Fetch messages for a channel
export const useMessages = (channelId: string | null, page = 1, limit = 50) => {
  return useQuery({
    queryKey: ["messages", channelId, page, limit],
    queryFn: async () => {
      if (!channelId) return null;

      const response = await fetch(
        `${API_BASE_URL}/api/messages/channels/${channelId}/messages?page=${page}&limit=${limit}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      return response.json();
    },
    enabled: !!channelId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      channelId,
      content,
    }: {
      channelId: string;
      content: string;
    }) => {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/channels/${channelId}/messages`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.channelId],
      });
    },
  });
};

// Fetch user's channels
export const useChannels = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/messages/channels`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch channels");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create a DM channel
export const useCreateDM = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipientId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/messages/channels/dm`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create DM channel");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate channels query to refetch
      queryClient.invalidateQueries({ queryKey: ["channels"] });
    },
  });
};

// Fetch online users
export const useOnlineUsers = () => {
  return useQuery({
    queryKey: ["onlineUsers"],
    queryFn: async (): Promise<OnlineUser[]> => {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/users/online`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch online users");
      }

      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Helper function to format message time
export const formatMessageTime = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    // 7 days
    return date.toLocaleDateString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

// Helper function to check if messages are from the same author
export const shouldGroupMessage = (
  currentMessage: Message,
  previousMessage: Message | null
) => {
  if (!previousMessage) return false;

  const timeDiff =
    new Date(currentMessage.createdAt).getTime() -
    new Date(previousMessage.createdAt).getTime();
  const fiveMinutes = 5 * 60 * 1000;

  return (
    currentMessage.authorId === previousMessage.authorId &&
    timeDiff < fiveMinutes
  );
};

