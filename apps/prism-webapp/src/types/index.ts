import { Server as NetServer } from "http";
import { NextApiResponse } from "next";
import { Server as SocketIOServer, Socket } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & { server: NetServer & { io: SocketIOServer } };
};
