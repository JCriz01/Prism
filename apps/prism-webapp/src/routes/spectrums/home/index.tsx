import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col h-full mx-9 items-center justify-center">
      <aside className="bg-black w-2xl"></aside>
      <main></main>
    </div>
  );
}
