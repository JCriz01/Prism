import { Server, type Socket as IOSocket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
// ⚠️ Prefer a dedicated prisma module to avoid circular imports
import { prismaClient } from '../app'; // <-- change this to wherever you export Prisma

type JwtPayload = { id: string; iat?: number; exp?: number };

type AuthedSocket = IOSocket & {
  userId?: string;
  username?: string;
};

export class SocketService {
  private io: Server;
  // If you only want one active connection per user, Map is OK.
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      path: '/socket.io',
      cors: {
        origin: [
          process.env.CLIENT_URL ?? 'http://localhost:3000',
          'http://localhost:3001',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket: AuthedSocket, next) => {
      try {
        console.log('socket.handshake.headers', socket.handshake.headers);

        //TODO:  potentially remove this since the token is sent without the Bearer prefix.
        const authHeader =
          (socket.handshake.headers.authorization as string | undefined) ?? '';
        console.log('authHeader', authHeader);
        const bearer = authHeader.startsWith('Bearer ')
          ? authHeader.slice('Bearer '.length)
          : undefined;

        const token = (socket.handshake.auth as any)?.token || bearer;
        console.log('token', token);
        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'secret',
        ) as JwtPayload;

        if (!decoded?.id) {
          return next(new Error('Authentication error: Invalid token payload'));
        }

        const user = await prismaClient.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, username: true, name: true },
        });

        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user.id;
        socket.username = user.username ?? user.id;
        return next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthedSocket) => {
      console.log(
        `User ${socket.username} (${socket.userId}) connected with socket ${socket.id}`,
      );

      if (socket.userId) {
        this.connectedUsers.set(socket.userId, socket.id);
        socket.join(`user_${socket.userId}`);
      }

      socket.on('join_channel', async (data: { channelId: string }) => {
        try {
          const { channelId } = data;

          // Verify access:
          // - If it's a DM, ensure current user is a participant
          // - If it's a spectrum channel, ensure membership in that spectrum
          const channel = await prismaClient.channel.findFirst({
            where: {
              id: channelId,
              OR: [
                // DM access: user must be one of the participants
                {
                  type: 'DM',
                  participants: {
                    some: { userId: socket.userId ?? '' },
                  },
                },
                // Spectrum access: user is a member of the spectrum
                {
                  spectrum: {
                    members: { some: { userId: socket.userId ?? '' } },
                  },
                },
              ],
            },
            select: { id: true },
          });

          if (!channel) {
            socket.emit('error', { message: 'Access denied to channel' });
            return;
          }

          socket.join(`channel_${channelId}`);
          socket.emit('joined_channel', { channelId });
          console.log(`User ${socket.username} joined channel ${channelId}`);
        } catch (error) {
          console.error('Error joining channel:', error);
          socket.emit('error', { message: 'Failed to join channel' });
        }
      });

      socket.on('leave_channel', (data: { channelId: string }) => {
        const { channelId } = data;
        socket.leave(`channel_${channelId}`);
        socket.emit('left_channel', { channelId });
        console.log(`User ${socket.username} left channel ${channelId}`);
      });

      socket.on(
        'send_message',
        async (data: { channelId: string; content: string }) => {
          try {
            const { channelId, content } = data;
            if (!socket.userId || !content?.trim()) {
              socket.emit('error', { message: 'Invalid message data' });
              return;
            }

            // Re-verify access on send
            const channel = await prismaClient.channel.findFirst({
              where: {
                id: channelId,
                OR: [
                  {
                    type: 'DM',
                    participants: {
                      some: { userId: socket.userId },
                    },
                  },
                  {
                    spectrum: {
                      members: { some: { userId: socket.userId } },
                    },
                  },
                ],
              },
              select: { id: true },
            });

            if (!channel) {
              socket.emit('error', { message: 'Access denied to channel' });
              return;
            }

            const message = await prismaClient.message.create({
              data: {
                content: content.trim(),
                channelId,
                authorId: socket.userId,
                type: 'DEFAULT',
              },
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    avatarUrl: true,
                  },
                },
              },
            });

            this.io.to(`channel_${channelId}`).emit('new_message', {
              id: message.id,
              content: message.content,
              channelId: message.channelId,
              authorId: message.authorId,
              author: message.author,
              createdAt: message.createdAt,
              type: message.type,
            });

            console.log(
              `Message sent by ${socket.username} in channel ${channelId}`,
            );
          } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
          }
        },
      );

      socket.on('typing_start', (data: { channelId: string }) => {
        const { channelId } = data;
        socket.to(`channel_${channelId}`).emit('user_typing', {
          userId: socket.userId,
          username: socket.username,
          channelId,
        });
      });

      socket.on('typing_stop', (data: { channelId: string }) => {
        const { channelId } = data;
        socket.to(`channel_${channelId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          username: socket.username,
          channelId,
        });
      });

      socket.on('disconnect', () => {
        console.log(`User ${socket.username} (${socket.userId}) disconnected`);
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
      });
    });
  }

  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  sendDirectMessage(userId: string, message: any) {
    this.io.to(`user_${userId}`).emit('direct_message', message);
  }

  broadcastToChannel(channelId: string, event: string, data: any) {
    this.io.to(`channel_${channelId}`).emit(event, data);
  }
}

export default SocketService;
