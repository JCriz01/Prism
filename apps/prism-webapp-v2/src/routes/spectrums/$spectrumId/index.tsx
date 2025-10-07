import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/$spectrumId/")({
  component: RouteComponent,
});

//* Main server landing page
function RouteComponent() {
  return (
    <div>
      Hello "/spectrums/{Route.useParams().spectrumId}/"! This is the main
      server landing page.
    </div>
  );
}
