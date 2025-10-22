import type { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { prismaClient as prisma } from '../../app';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../types/socket';

const joinSchema = z.object({ channelId: z.string().min(1) });
const sendSchema = z.object({
  channelId: z.string().min(1),
  content: z.string().min(1).max(4000),
  tempId: z.string().optional(),
  type: z.enum(['DEFAULT', 'REPLY', 'SYSTEM']).optional().default('DEFAULT'),
  replyToId: z.string().optional(),
});

export function registerChatHandlers(
  io: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>,
  socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>,
) {
  socket.on('channel:join', (payload) => {
    const parsed = joinSchema.safeParse(payload);
    if (!parsed.success) return;
    socket.join(`channel:${parsed.data.channelId}`);
  });

  socket.on('channel:leave', (payload) => {
    const parsed = joinSchema.safeParse(payload);
    if (!parsed.success) return;
    socket.leave(`channel:${parsed.data.channelId}`);
  });

  socket.on('message:send', async (payload, ack) => {
    try {
      if (!socket.data.user) return;

      const data = sendSchema.parse(payload);
      const msg = await prisma.message.create({
        data: {
          channelId: data.channelId,
          authorId: socket.data.user.id,
          content: data.content,
          type: data.type,
        },
        include: {
          author: {
            select: { id: true, username: true, name: true, avatarUrl: true },
          },
        },
      });

      const outgoing = {
        id: msg.id,
        channelId: msg.channelId,
        content: msg.content,
        author: msg.author,
        createdAt: msg.createdAt.toISOString(),
        type: msg.type as 'DEFAULT' | 'REPLY' | 'SYSTEM',
        tempId: data.tempId,
      };

      if (ack) ack({ ok: true, tempId: data.tempId, messageId: msg.id });

      const room = `channel:${data.channelId}`;
      socket.to(room).emit('message:new', outgoing);
      socket.emit('message:new', outgoing);
    } catch (e) {
      //socket.emit('error', { message: 'Failed to send message' });
    }
  });
}
