import type { Socket } from 'socket.io';

type Bucket = { tokens: number; last: number };

export function rateLimit(maxPerSec = 8) {
  // token bucket per socket.id
  const buckets = new Map<string, Bucket>();
  return (socket: Socket, next: (err?: Error) => void) => {
    buckets.set(socket.id, { tokens: maxPerSec, last: Date.now() });
    socket.onAny((event) => {
      const b = buckets.get(socket.id);
      if (!b) return;
      const now = Date.now();
      const delta = (now - b.last) / 1000;
      b.tokens = Math.min(maxPerSec, b.tokens + delta * maxPerSec);
      b.last = now;
      if (b.tokens < 1) {
        socket.emit('error', { message: 'Rate limit exceeded', event });
        // optional: disconnect on abuse
        return;
      }
      b.tokens -= 1;
    });
    socket.on('disconnect', () => buckets.delete(socket.id));
    next();
  };
}
