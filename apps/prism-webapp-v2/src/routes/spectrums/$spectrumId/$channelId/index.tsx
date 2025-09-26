import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/$spectrumId/$channelId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/spectrums/{Route.useParams().spectrumId}/
      {Route.useParams().channelId}/"!
    </div>
  );
}
