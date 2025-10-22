import 'express-serve-static-core';
import type { Server as IOServer } from 'socket.io';

declare module 'express-serve-static-core' {
  interface Application {
    get(name: 'io'): IOServer;
    set(name: 'io', val: IOServer): this;
  }
}
