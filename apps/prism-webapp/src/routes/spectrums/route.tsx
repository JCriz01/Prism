import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { ServerSidebar } from "@/components/server-sidebar";
import { useUserStore } from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { set } from "zod";

const fetchUser = async () => {
  const token = localStorage.getItem("user-token");
  const res = await fetch("http://localhost:5200/api/users/session", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await res.json();
  return res.json();
};

export const Route = createFileRoute("/spectrums")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!localStorage.getItem("user-token")) {
      throw redirect({
        to: "/auth/login",
        search: location.href,
      });
    }
  },
});

function RouteComponent() {
  const setUser = useUserStore((state) => state.updateUser);
  const { isPending, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  if (!isPending) setUser(data);

  return (
    <div className="flex h-full items-center justify-start w-full">
      {/* Server sidebar */}

      {/*}
      <div className={`${"block"} w-[72px] h-full bg-black `}>
        <ServerSidebar onServerClick={() => setActiveView("spectrum")} />
      </div>
      */}
      <Outlet />
    </div>
  );
}
