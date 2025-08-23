import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/spectrums/server/$serverId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/spectrums/server/$serverId/"!</div>
}
