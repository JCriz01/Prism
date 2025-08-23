"use client";

import { Plus, Compass, Download, Upload, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { ServerModal } from "@/components/server-modal";
import { Button } from "@/components/ui/button";
interface ServerSidebarProps {
  onServerClick: () => void;
}

const fetchSpectrums = async () => {
  const res = await fetch(`http://localhost:5200/api/server/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user-token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  return data;
};

const fetchFriends = async () => {
  const res = await fetch(`http://localhost:5200/api/users/friends/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("user-token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  return data;
};

export function ServerSidebar({ onServerClick }: ServerSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiData = useQuery({
    queryKey: ["spectrum"],
    queryFn: fetchSpectrums,
  });

  console.log("spectrumData", apiData);

  if (apiData.isLoading) {
    return <div>Loading...</div>;
  }
  if (apiData.error) return <div>Error: {apiData.error?.message}</div>;

  return (
    <div className="flex flex-col items-center py-3 gap-2 h-full overflow-y-auto">
      {/*  home button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center hover:rounded-2xl transition-all duration-200"
              onClick={onServerClick}
            ></button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator className="h-[2px] bg-gray-700 w-8 my-1" />

      {/* Server list */}
      <div className="flex flex-col gap-2 w-full items-center">
        {apiData.isError && <p>...</p>}
        {apiData.data.servers.map((server) => (
          <TooltipProvider key={server.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-12 h-12 rounded-full bg-[#36393f] flex items-center justify-center hover:rounded-2xl transition-all duration-200 hover:bg-[#5865f2]"
                  onClick={onServerClick}
                >
                  <span className="text-white font-semibold">
                    {server.initial}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{server.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Add server button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 rounded-full bg-[#36393f] flex items-center justify-center hover:rounded-2xl transition-all duration-200 hover:bg-green-500 mt-2"
            >
              <Plus className="text-green-500 hover:text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add a Server</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Explore spectrums button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 rounded-full bg-[#36393f] flex items-center justify-center hover:rounded-2xl transition-all duration-200 hover:bg-green-500">
              <Compass className="text-green-500 hover:text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Explore Spectrums</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator className="h-[2px] bg-gray-700 w-8 my-1" />

      {/* Download apps button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-12 h-12 rounded-full bg-[#36393f] flex items-center justify-center hover:rounded-2xl transition-all duration-200 hover:bg-green-500">
              <Download className="text-green-500 hover:text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Download Apps</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Add Sever Functionality Modal */}
      <ServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
