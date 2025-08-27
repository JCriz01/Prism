import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/$spectrumId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/spectrums/$spectrumId/"!</div>;
}
