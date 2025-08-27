import { useState } from "react";
import { Crown, Shield, Circle, Volume2, Mic, MicOff } from "lucide-react";

interface MembersListProps {
  selectedServer: string | null;
}

interface Member {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: "online" | "idle" | "dnd" | "offline";
  role: "owner" | "admin" | "moderator" | "member";
  isInVoice?: boolean;
  isMuted?: boolean;
  isDeafened?: boolean;
}

// Mock data - in a real app this would come from an API
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Alex Johnson",
    username: "alexj",
    avatar: "👨‍💻",
    status: "online",
    role: "owner",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    username: "sarahw",
    avatar: "👩‍🎨",
    status: "online",
    role: "admin",
    isInVoice: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    username: "mikec",
    avatar: "👨‍🎮",
    status: "idle",
    role: "moderator",
    isInVoice: true,
    isMuted: true,
  },
  {
    id: "4",
    name: "Emma Davis",
    username: "emmad",
    avatar: "👩‍🏫",
    status: "dnd",
    role: "member",
  },
  {
    id: "5",
    name: "David Brown",
    username: "davidb",
    avatar: "👨‍🔬",
    status: "offline",
    role: "member",
  },
];

const getRoleIcon = (role: Member["role"]) => {
  switch (role) {
    case "owner":
      return <Crown className="w-4 h-4 text-yellow-400" />;
    case "admin":
      return <Shield className="w-4 h-4 text-red-400" />;
    case "moderator":
      return <Shield className="w-4 h-4 text-blue-400" />;
    default:
      return null;
  }
};

const getRoleColor = (role: Member["role"]) => {
  switch (role) {
    case "owner":
      return "text-yellow-400";
    case "admin":
      return "text-red-400";
    case "moderator":
      return "text-blue-400";
    default:
      return "text-gray-400";
  }
};

const getStatusColor = (status: Member["status"]) => {
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

const getStatusIcon = (status: Member["status"]) => {
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

export function MembersList({ selectedServer }: MembersListProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Don't render if no server is selected
  if (!selectedServer) {
    return null;
  }

  return (
    <div className="w-60 bg-[#2f3136] border-l border-[#202225] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#202225]">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Members — {mockMembers.length}
        </h3>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        {mockMembers.map((member) => (
          <div
            key={member.id}
            className={`p-3 hover:bg-[#40444b] transition-colors cursor-pointer ${
              selectedMember === member.id ? "bg-[#40444b]" : ""
            }`}
            onClick={() => setSelectedMember(member.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-sm">
                  {member.avatar}
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)}`}
                >
                  {getStatusIcon(member.status)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-white truncate">
                    {member.name}
                  </span>
                  {getRoleIcon(member.role)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                  {member.isInVoice && (
                    <div className="flex items-center space-x-1">
                      {member.isMuted ? (
                        <MicOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Mic className="w-3 h-3 text-green-400" />
                      )}
                      <Volume2 className="w-3 h-3 text-blue-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
