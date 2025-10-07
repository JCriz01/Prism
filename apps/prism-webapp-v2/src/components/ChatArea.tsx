import { useState, useEffect, useRef } from "react";
import { Send, Hash, Users, Search, Inbox, HelpCircle } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { WelcomeScreen } from "./WelcomeScreen";
import { useSocket } from "@/hooks/useSocket";
import { useTypingUsers } from "@/hooks/useSocket";
import {
  useMessages,
  useSendMessage,
  formatMessageTime,
  shouldGroupMessage,
} from "@/lib/api/messages";

interface ChatAreaProps {
  selectedServer: string | null;
  selectedChannel: string | null;
  onShowFriends: () => void;
}

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

const getChannelName = (channelId: string) => {
  // In a real app, this would fetch from the selected server's channels
  const channelMap: Record<string, string> = {
    "1-1": "general",
    "1-2": "gaming-chat",
    "1-3": "voice-chat",
    "2-1": "general",
    "2-2": "homework-help",
    "2-3": "study-sessions",
    "3-1": "general",
    "3-2": "music-chat",
    "3-3": "music-room",
  };
  return channelMap[channelId] || "general";
};

const getServerName = (serverId: string) => {
  const serverMap: Record<string, string> = {
    "1": "Gaming Hub",
    "2": "Study Group",
    "3": "Music Lovers",
  };
  return serverMap[serverId] || "Unknown Server";
};

export function ChatArea({
  selectedServer,
  selectedChannel,
  onShowFriends,
}: ChatAreaProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token");

  // Socket connection
  const {
    isConnected,
    joinChannel,
    leaveChannel,
    onNewMessage,
    startTyping,
    stopTyping,
  } = useSocket(token);

  // Typing users
  const typingUsers = useTypingUsers(selectedChannel);

  // Messages from API
  const { data: messagesData, isLoading } = useMessages(selectedChannel);
  const sendMessageMutation = useSendMessage();

  const messages = messagesData?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join/leave channel when selection changes
  useEffect(() => {
    if (selectedChannel && isConnected) {
      joinChannel(selectedChannel);
    } else if (!selectedChannel) {
      leaveChannel();
    }

    return () => {
      if (selectedChannel) {
        leaveChannel();
      }
    };
  }, [selectedChannel, isConnected, joinChannel, leaveChannel]);

  // Listen for new messages
  useEffect(() => {
    if (!selectedChannel) return;

    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.channelId === selectedChannel) {
        // The message will be refetched by the query invalidation
        scrollToBottom();
      }
    };

    const cleanup = onNewMessage(handleNewMessage);
    return cleanup;
  }, [selectedChannel, onNewMessage]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChannel) return;

    try {
      // Send via API (which will trigger socket broadcast)
      await sendMessageMutation.mutateAsync({
        channelId: selectedChannel,
        content: message.trim(),
      });

      setMessage("");
      stopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  if (!selectedServer || !selectedChannel) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex-1 bg-[#36393f] flex flex-col">
      {/* Channel Header */}
      <div className="h-14 bg-[#2f3136] border-b border-[#202225] flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Hash className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-white">
            {getChannelName(selectedChannel)}
          </span>
          <span className="text-sm text-gray-400">
            in {getServerName(selectedServer)}
          </span>
          {!isConnected && (
            <span className="text-xs text-red-400">(Disconnected)</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-[#40444b] rounded-md transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-[#40444b] rounded-md transition-colors">
            <Inbox className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-[#40444b] rounded-md transition-colors">
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </button>
          <button
            className="p-2 hover:bg-[#40444b] rounded-md transition-colors"
            onClick={onShowFriends}
          >
            <Users className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : (
          messages.map((msg: Message, index: number) => {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            const shouldGroup = shouldGroupMessage(msg, previousMessage);

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 group hover:bg-[#40444b] p-2 rounded-md transition-colors ${
                  shouldGroup ? "mt-1" : "mt-4"
                }`}
              >
                {!shouldGroup && (
                  <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
                    {msg.author.avatarUrl ? (
                      <img
                        src={msg.author.avatarUrl}
                        alt={msg.author.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      msg.author.username.charAt(0).toUpperCase()
                    )}
                  </div>
                )}
                {shouldGroup && <div className="w-10 h-10 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  {!shouldGroup && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">
                        {msg.author.name || msg.author.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-200 break-words">{msg.content}</p>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 p-2 text-sm text-gray-400">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0].username} is typing...`
                : `${typingUsers.length} people are typing...`}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#2f3136] border-t border-[#202225]">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${getChannelName(selectedChannel)}`}
              className="w-full p-3 bg-[#40444b] border border-[#202225] rounded-md text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#5865f2] focus:border-transparent"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "144px" }}
              disabled={!isConnected || sendMessageMutation.isPending}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              !message.trim() || !isConnected || sendMessageMutation.isPending
            }
            className="p-3 bg-[#5865f2] hover:bg-[#4752c4] disabled:bg-[#40444b] disabled:cursor-not-allowed rounded-md transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
