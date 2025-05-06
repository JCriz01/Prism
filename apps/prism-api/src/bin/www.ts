#!/usr/bin/env node
// Starting point of the application.
/**
 * Module dependencies.
 */

import app from '../app';
var debug = require('debug')('prism-api:server');
import http from 'http';
const { Server } = require('socket.io');
//* ENV variables
const hostname = process.env.ServerHost || 'localhost';

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
/*
//Implementing Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('private_message', ({ content, to }) => {
    io.to(to).emit('private_message', { content, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});
*/
server.listen({ port, hostname }, () =>
  console.log('Server initilized on host:', `${hostname}:${port}`),
);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  console.error('Server Error: ', error.message);
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = addr
    ? typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port
    : 'unknown';
  debug('Listening on ' + bind);
}
