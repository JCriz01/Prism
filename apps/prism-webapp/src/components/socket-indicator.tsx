"use client";

import React from "react";
import { Wifi, WifiOff } from "lucide-react";

import { useSocket } from "@/components/providers/socket-provider";

export function SocketIndicator() {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div className="flex items-center gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
        <WifiOff className="h-4 w-4" />
        <p className="font-medium text-red-400">Reconnecting</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-x-2 text-xs text-zinc-500 dark:text-zinc-400">
      <Wifi className="h-4 w-4" />
      <p className="font-medium text-green-400">Live</p>
    </div>
  );
}
