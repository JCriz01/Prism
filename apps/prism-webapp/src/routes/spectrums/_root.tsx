import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/_root")({
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
  return <div>Hello "/spectrums/_root"!</div>;
}
