import { prismaClient as prisma } from '../app';
export async function createMessage(opts: {
  channelId: string;
  authorId: string;
  content: string;
  type: 'DEFAULT' | 'REPLY' | 'SYSTEM';
  replyToId?: string | null;
}) {
  return prisma.message.create({
    data: {
      channelId: opts.channelId,
      authorId: opts.authorId,
      content: opts.content,
      type: opts.type,
    },
    include: {
      author: {
        select: { id: true, username: true, name: true, avatarUrl: true },
      },
    },
  });
}
