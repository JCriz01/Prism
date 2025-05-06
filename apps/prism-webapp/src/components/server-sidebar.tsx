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
import { useQueries } from "@tanstack/react-query";
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
  const servers = [
    { id: "1", name: "Discord Clone", initial: "D" },
    { id: "2", name: "Gaming", initial: "G" },
    { id: "3", name: "Music", initial: "M" },
    { id: "4", name: "Development", initial: "D" },
    { id: "5", name: "Art", initial: "A" },
  ];

  const apiData = useQueries({
    queries: [
      { queryKey: ["spectrum"], queryFn: fetchSpectrums },
      { queryKey: ["friends"], queryFn: fetchFriends },
    ],
  });

  const isLoading = apiData.some((query) => query.isLoading);
  const isError = apiData.some((query) => query.isError);
  const error = apiData.find((query) => query.isError)?.error;
  const [spectrumData, friendsData] = apiData.map((query) => query.data);
  console.log("spectrumData", spectrumData);
  console.log("friendsData", friendsData);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <div className="flex flex-col items-center py-3 gap-2 h-full overflow-y-auto">
      {/* Discord home button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="w-12 h-12 rounded-full bg-[#5865f2] flex items-center justify-center hover:rounded-2xl transition-all duration-200"
              onClick={onServerClick}
            >
              <svg width="28" height="20" viewBox="0 0 28 20">
                <path
                  fill="white"
                  d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z"
                ></path>
              </svg>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Home</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator className="h-[2px] bg-gray-700 w-8 my-1" />

      {/* Server list */}
      <div className="flex flex-col gap-2 w-full items-center">
        {isLoading ? (
          <p>Loading servers...</p>
        ) : (
          spectrumData.servers.map((server) => (
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
          ))
        )}
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
