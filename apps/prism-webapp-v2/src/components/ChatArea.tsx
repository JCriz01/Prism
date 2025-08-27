import { useState, useEffect, useRef } from "react";
import {
  Send,
  Hash,
  Volume2,
  Users,
  Search,
  Inbox,
  HelpCircle,
  Settings,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { WelcomeScreen } from "./WelcomeScreen";

interface ChatAreaProps {
  selectedServer: string | null;
  selectedChannel: string | null;
  onShowFriends: () => void;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isEdited?: boolean;
}

// Mock data - in a real app this would come from an API
const mockMessages: Message[] = [
  {
    id: "1",
    userId: "user1",
    username: "Alex Johnson",
    avatar: "👨‍💻",
    content: "Hey everyone! How's it going?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    userId: "user2",
    username: "Sarah Wilson",
    avatar: "👩‍🎨",
    content: "Pretty good! Working on some new designs.",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: "3",
    userId: "user3",
    username: "Mike Chen",
    avatar: "👨‍🎮",
    content: "Anyone up for a game later?",
    timestamp: new Date(Date.now() - 1000 * 60 * 1),
  },
  {
    id: "4",
    userId: "user1",
    username: "Alex Johnson",
    avatar: "👨‍💻",
    content: "I'm down! What are we playing?",
    timestamp: new Date(Date.now() - 1000 * 30),
  },
];

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
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUserStore((state) => state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChannel) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: "currentUser",
      username: user.name || "Anonymous",
      avatar: "👤",
      content: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start space-x-3 group hover:bg-[#40444b] p-2 rounded-md transition-colors"
          >
            <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">
              {msg.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-white">{msg.username}</span>
                <span className="text-xs text-gray-400">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {msg.isEdited && (
                  <span className="text-xs text-gray-400">(edited)</span>
                )}
              </div>
              <p className="text-gray-200 break-words">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-[#2f3136] border-t border-[#202225]">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message #${getChannelName(selectedChannel)}`}
              className="w-full p-3 bg-[#40444b] border border-[#202225] rounded-md text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#5865f2] focus:border-transparent"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "144px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-3 bg-[#5865f2] hover:bg-[#4752c4] disabled:bg-[#40444b] disabled:cursor-not-allowed rounded-md transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
