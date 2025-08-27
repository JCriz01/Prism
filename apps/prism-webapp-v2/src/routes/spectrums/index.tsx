import { FriendsSidebar } from "@/components/FriendsSidebar";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/")({
  /*
  beforeLoad: () => {
    throw redirect({ to: "/spectrums" });
  },
  */
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      {/* Friends Sidebar {showFriends && <FriendsSidebar onClose={() => setShowFriends(false)} />} */}
      <FriendsSidebar onClose={() => {}} />
    </div>
  );
}
