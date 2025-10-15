import { useEffect, useRef, useState } from "react";
import { socketService } from "../lib/socketService";
import { Socket } from "socket.io-client";

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

interface TypingUser {
  userId: string;
  username: string;
  channelId: string;
}

export function useSocket(token: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const joinedChannelRef = useRef<string | null>(null);

  useEffect(() => {
    if (token) {
      socketService.connect(token);

      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socketService.on("connect", handleConnect);
      socketService.on("disconnect", handleDisconnect);

      return () => {
        socketService.off("connect", handleConnect);
        socketService.off("disconnect", handleDisconnect);
        socketService.disconnect();
        setIsConnected(false);
      };
    }
  }, [token]);

  const joinChannel = (channelId: string) => {
    console.log(joinedChannelRef.current, channelId);
    if (joinedChannelRef.current === channelId) return; // Already joined

    socketService.joinChannel(channelId);
    setCurrentChannel(channelId);
    joinedChannelRef.current = channelId;
    // Clear typing users when switching channels
    setTypingUsers([]);
  };

  const leaveChannel = () => {
    if (!currentChannel) return;
    if (joinedChannelRef.current !== currentChannel) return; // Not joined

    if (currentChannel) {
      socketService.leaveChannel(currentChannel);
      setCurrentChannel(null);
      setTypingUsers([]);
    }
  };

  const sendMessage = (content: string) => {
    if (currentChannel && content.trim()) {
      socketService.sendMessage(currentChannel, content.trim());
    }
  };

  const startTyping = () => {
    if (currentChannel) {
      socketService.startTyping(currentChannel);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  };

  const stopTyping = () => {
    if (currentChannel) {
      socketService.stopTyping(currentChannel);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const onNewMessage = (callback: (message: Message) => void) => {
    socketService.onNewMessage(callback);

    return () => {
      socketService.offNewMessage(callback);
    };
  };

  const onUserTyping = (callback: (data: TypingUser) => void) => {
    socketService.onUserTyping(callback);

    return () => {
      socketService.offUserTyping(callback);
    };
  };

  const onUserStoppedTyping = (callback: (data: TypingUser) => void) => {
    socketService.onUserStoppedTyping(callback);

    return () => {
      socketService.offUserStoppedTyping(callback);
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    currentChannel,
    typingUsers,
    joinChannel,
    leaveChannel,
    sendMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onUserTyping,
    onUserStoppedTyping,
  };
}

export function useTypingUsers(channelId: string | null) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    if (!channelId) {
      setTypingUsers([]);
      return;
    }

    const handleUserTyping = (data: TypingUser) => {
      if (data.channelId === channelId) {
        setTypingUsers((prev) => {
          const exists = prev.find((user) => user.userId === data.userId);
          if (!exists) {
            return [...prev, data];
          }
          return prev;
        });
      }
    };

    const handleUserStoppedTyping = (data: TypingUser) => {
      if (data.channelId === channelId) {
        setTypingUsers((prev) =>
          prev.filter((user) => user.userId !== data.userId)
        );
      }
    };

    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStoppedTyping(handleUserStoppedTyping);

    return () => {
      socketService.offUserTyping(handleUserTyping);
      socketService.offUserStoppedTyping(handleUserStoppedTyping);
    };
  }, [channelId]);

  return typingUsers;
}
