import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import type { SocketData } from '../types/socket';
import { prismaClient } from '../../app';
type JwtPayload = {
  id: string;
  iat?: number;
  exp?: number;
  username?: string;
  sub?: string;
};

export function socketAuth() {
  return async (
    socket: Socket<any, any, any, SocketData>,
    next: (err?: Error) => void,
  ) => {
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
      socket.data.user = {
        id: decoded.sub ?? '',
        username: decoded.username!,
      };
      return next();
    } catch (err) {
      return next(new Error('Unauthorized: invalid token'));
    }
  };
}
