import { useState } from "react";
import { Settings, LogOut, User, Shield, Moon, Sun } from "lucide-react";
import { useUserStore } from "@/store/userStore";

export function UserAccount() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const user = useUserStore((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("user-token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="h-16 bg-[#292b2f] border-t border-[#202225] flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-sm font-bold">
          {user.avatar || user.name?.charAt(0) || "U"}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">
            {user.name || "Anonymous User"}
          </span>
          <span className="text-xs text-gray-400">
            @{user.username || "user"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 hover:bg-[#40444b] rounded-md transition-colors"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-gray-400" />
          ) : (
            <Moon className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <button className="p-1.5 hover:bg-[#40444b] rounded-md transition-colors">
          <User className="w-4 h-4 text-gray-400" />
        </button>

        <button className="p-1.5 hover:bg-[#40444b] rounded-md transition-colors">
          <Shield className="w-4 h-4 text-gray-400" />
        </button>

        <button className="p-1.5 hover:bg-[#40444b] rounded-md transition-colors">
          <Settings className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={handleLogout}
          className="p-1.5 hover:bg-[#40444b] rounded-md transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
