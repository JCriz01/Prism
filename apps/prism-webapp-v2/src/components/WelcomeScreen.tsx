import { Plus, Users, Hash, Volume2 } from "lucide-react";

export function WelcomeScreen() {
  return (
    <div className="flex-1 bg-[#36393f] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#5865f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎮</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Prism
          </h1>
          <p className="text-gray-400 text-lg">
            Your Discord-like communication platform
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#2f3136] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Getting Started
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Join a Server</h3>
                  <p className="text-gray-400 text-sm">
                    Click on a server in the sidebar to get started
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
                  <Hash className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Choose a Channel</h3>
                  <p className="text-gray-400 text-sm">
                    Select a text channel to start chatting
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    Connect with Friends
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Use the friends sidebar to see who's online
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Voice Channels</h3>
                  <p className="text-gray-400 text-sm">
                    Join voice channels for real-time communication
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-400 text-sm">
            <p>Ready to start? Select a server from the left sidebar!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
