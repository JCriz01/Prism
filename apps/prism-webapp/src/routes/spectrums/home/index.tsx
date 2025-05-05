import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";

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

function RouteComponent() {
  const { user } = useUserStore();
  console.log("user", user);

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
    <div className="flex h-full items-center justify-start">
      <aside className="bg-black w-16 h-full self-start flex flex-col items-center justify-start py-6">
        <div className="bg-white m-2">Logo</div>
        <div className="bg-white w-[42px] h-[42px] ">Add Server</div>
        {spectrumData &&
          spectrumData.servers.map((spectrum: any) => {
            return (
              <div
                key={spectrum.id}
                className="bg-white w-[42px] h-[42px] p-2 m-2 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200"
              >
                {spectrum.name}
              </div>
            );
          })}
      </aside>
      <main className="bg-green-300 ">Testing Testing</main>
    </div>
  );
}
