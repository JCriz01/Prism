export type MessageType = 'DEFAULT' | 'REPLY' | 'SYSTEM';

export interface ClientToServerEvents {
  'channel:join': (payload: { channelId: string }) => void;
  'channel:leave': (payload: { channelId: string }) => void;

  'message:send': (
    payload: {
      channelId: string;
      content: string;
      tempId?: string;
      type?: MessageType;
      replyToId?: string | null;
    },
    ack?: (result: { ok: true; tempId?: string; messageId: string }) => void,
  ) => void;

  'typing:start': (payload: { channelId: string }) => void;
  'typing:stop': (payload: { channelId: string }) => void;
}

export interface ServerToClientEvents {
  'message:new': (payload: {
    id: string;
    channelId: string;
    content: string | null;
    author: {
      id: string;
      username: string;
      name: string;
      avatarUrl?: string | null;
    };
    createdAt: string;
    type: MessageType;
    tempId?: string;
  }) => void;

  'typing:update': (payload: {
    channelId: string;
    userId: string;
    isTyping: boolean;
  }) => void;

  'presence:update': (payload: { userId: string; online: boolean }) => void;
}

export interface InterServerEvents {}
export interface SocketData {
  user?: { id: string; username: string };
}
