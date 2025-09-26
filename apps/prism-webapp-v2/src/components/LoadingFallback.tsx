export function LoadingFallback() {
  return (
    <div className="flex h-screen bg-[#36393f] items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#5865f2] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-3xl">🎮</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Loading Prism</h1>
        <p className="text-gray-400">Prism is loading...</p>
        <div className="mt-6 flex justify-center">
          <div className="w-2 h-2 bg-[#5865f2] rounded-full animate-bounce mx-1"></div>
          <div
            className="w-2 h-2 bg-[#5865f2] rounded-full animate-bounce mx-1"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#5865f2] rounded-full animate-bounce mx-1"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
