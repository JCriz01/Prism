import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
import { ServerSidebar } from "@/components/server-sidebar";
import { ChannelSidebar } from "@/components/channel-sidebar";
import { ChatArea } from "@/components/chat-area";
import { MembersList } from "@/components/members-list";
import { useState } from "react";
export const Route = createFileRoute("/spectrums/home/")({
  beforeLoad: async ({ location }) => {
    if (!localStorage.getItem("user-token")) {
      throw redirect({
        to: "/auth/login",
        search: location.href,
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();
  const token = localStorage.getItem("user-token");
  const [activeView, setActiveView] = useState<
    "spectrum" | "channel" | "chat" | "friends" | "members"
  >("spectrum");
  console.log("user", user);

  return (
    <div className="flex h-full items-center justify-start">
      {/* Server sidebar */}
      <div className={`${"block"} w-[72px] h-full bg-black `}>
        <ServerSidebar onServerClick={() => setActiveView("spectrum")} />
      </div>
      {/* Channel Sidebar */}
      <div className={`${"block"} w-60 h-full bg-slate-900 `}>
        <ChannelSidebar onChannelClick={() => setActiveView("chat")} />
      </div>
      {/* Chat area */}
      <div className=" flex-col flex-grow h-full bg-slate-900">
        <ChatArea onMembersClick={() => setActiveView("members")} />
      </div>
      {/* member sidebar */}
      <div className="block w-60 h-full bg-slate-900 ">
        <MembersList onBackClick={() => setActiveView("chat")} />
      </div>
    </div>
  );
}
