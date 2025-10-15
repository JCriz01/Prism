import { Router } from 'express';
import { prismaClient } from '../app';
import { asyncHandler } from '../middleware/async-handler';
import {
  AppError,
  badRequest,
  notFound,
  unauthorized,
} from '../errors/app-error';
import passport from 'passport';

const router = Router();

// Get messages for a channel
router.get(
  '/channels/:channelId/messages',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = (req.user as any)?.id;

    if (!userId) {
      throw unauthorized('User not authenticated');
    }

    // Verify user has access to this channel
    const channel = await prismaClient.channel.findFirst({
      where: {
        id: channelId,
        OR: [
          { type: 'DM' },
          {
            spectrum: {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        ],
      },
    });

    if (!channel) {
      throw notFound('Channel not found or access denied');
    }

    const skip = (Number(page) - 1) * Number(limit);

    const messages = await prismaClient.message.findMany({
      where: { channelId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        attachments: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    });

    const totalCount = await prismaClient.message.count({
      where: { channelId },
    });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  }),
);

// Send a message to a channel
router.post(
  '/channels/:channelId/messages',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      throw unauthorized('User not authenticated');
    }

    if (!content || !content.trim()) {
      throw badRequest('Message content is required');
    }

    // Verify user has access to this channel
    const channel = await prismaClient.channel.findFirst({
      where: {
        id: channelId,
        OR: [
          { type: 'DM' },
          {
            spectrum: {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          },
        ],
      },
    });

    if (!channel) {
      throw notFound('Channel not found or access denied');
    }

    const message = await prismaClient.message.create({
      data: {
        content: content.trim(),
        channelId,
        authorId: userId,
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
        attachments: true,
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    // Broadcast the message via Socket.IO
    const socketService = req.app.get('socketService');
    if (socketService) {
      socketService.broadcastToChannel(channelId, 'new_message', {
        id: message.id,
        content: message.content,
        channelId: message.channelId,
        authorId: message.authorId,
        author: message.author,
        createdAt: message.createdAt,
        type: message.type,
      });
      console.log(`API: Broadcasting message to channel_${channelId}:`, {
        id: message.id,
        content: message.content,
        authorId: message.authorId,
      });
    }

    res.status(201).json(message);
  }),
);

// Get user's channels (spectrums and DMs)
router.get(
  '/channels',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res) => {
    const userId = (req.user as any)?.id;

    if (!userId) {
      throw unauthorized('User not authenticated');
    }

    // Get spectrum channels
    const spectrumChannels = await prismaClient.channel.findMany({
      where: {
        spectrum: {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      },
      include: {
        spectrum: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: [{ spectrum: { name: 'asc' } }, { position: 'asc' }],
    });

    // Get DM channels (channels where user is involved in DMs)
    const dmChannels = await prismaClient.channel.findMany({
      where: {
        type: 'DM',
        // This would need to be implemented based on your DM logic
        // For now, we'll get channels where the user has sent messages
        messages: {
          some: {
            authorId: userId,
          },
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
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
        },
      },
    });

    res.json({
      spectrumChannels,
      dmChannels,
    });
  }),
);

// Create a DM channel between two users
router.post(
  '/channels/dm',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res) => {
    const { recipientId } = req.body;
    const userId = (req.user as any)?.id;

    if (!userId) {
      throw unauthorized('User not authenticated');
    }

    if (!recipientId) {
      throw badRequest('Recipient ID is required');
    }

    if (userId === recipientId) {
      throw badRequest('Cannot create DM with yourself');
    }

    // Check if recipient exists
    const recipient = await prismaClient.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      throw notFound('Recipient not found');
    }

    // Check if DM channel already exists
    let dmChannel = await prismaClient.channel.findFirst({
      where: {
        type: 'DM',
        messages: {
          some: {
            authorId: { in: [userId, recipientId] },
          },
        },
      },
      include: {
        messages: true,
      },
    });

    // If no existing DM channel, create one
    if (!dmChannel) {
      dmChannel = await prismaClient.channel.create({
        data: {
          type: 'DM',
          name: `DM: ${recipient.username}`,
          createdById: userId,
        },
        include: {
          messages: true,
        },
      });
    }

    res.status(201).json(dmChannel);
  }),
);

// Get online users
router.get(
  '/users/online',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(async (req, res) => {
    const socketService = req.app.get('socketService');
    const onlineUserIds = socketService.getOnlineUsers();

    const onlineUsers = await prismaClient.user.findMany({
      where: {
        id: { in: onlineUserIds },
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatarUrl: true,
      },
    });

    res.json(onlineUsers);
  }),
);

export default router;
