import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ServerSidebar } from "@/components/server-sidebar";
import { useState } from "react";
import { FriendSidebar } from "@/components/friend-sidebar";
import { ChatArea } from "@/components/chat-area";
import { MembersList } from "@/components/members-list";
import { Divide } from "lucide-react";
import { PrivateDM } from "@/components/private-dm";
export const Route = createFileRoute("/spectrums/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="w-60 h-full bg-slate-900  p-4">
        <FriendSidebar />
      </div>
      {/* DM area */}
      <div className=" flex-col h-full bg-slate-900 grow">
        <PrivateDM onMembersClick={() => setActiveView("members")} />
      </div>
      {/* member sidebar */}
      <div className="block w-60 h-full bg-slate-900 ">
        <MembersList onBackClick={() => setActiveView("chat")} />
      </div>
    </>
  );
}
