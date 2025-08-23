import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/spectrums/server/$serverId/channel/$channelId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/spectrums/server/$serverId/channel/$channelId"!</div>
}
