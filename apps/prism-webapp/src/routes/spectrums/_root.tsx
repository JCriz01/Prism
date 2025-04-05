import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/spectrums/_root")({
  /*
  beforeLoad: async ({location}) => {
    if(!isAuthenticated()){
      throw redirect({
        to: '/auth/login',
        search: location.href
      })
    }
  },
  */
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/spectrums/_root"!</div>;
}
