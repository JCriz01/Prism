import { createFileRoute } from "@tanstack/react-router";
import { ChatArea } from "@/components/ChatArea";

export const Route = createFileRoute("/spectrums/$spectrumId/$channelId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full w-full">
      <ChatArea
        selectedServer={Route.useParams().spectrumId}
        selectedChannel={Route.useParams().channelId}
        onShowFriends={() => {}}
      />
    </div>
  );
}
