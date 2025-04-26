import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";

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
  console.log("user", user);
  return (
    <div className="flex h-full items-center justify-start">
      <aside className="bg-black w-16 h-full self-start"></aside>
      <main className="bg-green-300 ">Testing Testing</main>
    </div>
  );
}
