import type { Server, Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../types/socket';
import { z } from 'zod';

const channelSchema = z.object({ channelId: z.string().min(1) });

export function registerPresenceHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>,
) {
  if (!socket.data.user) return;

  // presence announce
  socket.broadcast.emit('presence:update', {
    userId: socket.data.user.id,
    online: true,
  });

  // typing updates
  socket.on('typing:start', (payload) => {
    const p = channelSchema.safeParse(payload);
    if (!p.success || !socket.data.user) return;
    io.to(`channel:${p.data.channelId}`).emit('typing:update', {
      channelId: p.data.channelId,
      userId: socket.data.user.id,
      isTyping: true,
    });
  });

  socket.on('typing:stop', (payload) => {
    const p = channelSchema.safeParse(payload);
    if (!p.success || !socket.data.user) return;
    io.to(`channel:${p.data.channelId}`).emit('typing:update', {
      channelId: p.data.channelId,
      userId: socket.data.user.id,
      isTyping: false,
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('presence:update', {
      userId: socket.data.user!.id,
      online: false,
    });
  });
}
