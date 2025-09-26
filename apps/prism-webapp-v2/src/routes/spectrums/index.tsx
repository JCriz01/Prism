import { FriendsSidebar } from "@/components/FriendsSidebar";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
export const Route = createFileRoute("/spectrums/")({
  /*
  beforeLoad: () => {
    throw redirect({ to: "/spectrums" });
  },
  */
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useUserStore();
  console.log("user", user);
  return (
    <div>
      {/* Friends Sidebar {showFriends && <FriendsSidebar onClose={() => setShowFriends(false)} />} */}
      <FriendsSidebar onClose={() => {}} />
    </div>
  );
}
