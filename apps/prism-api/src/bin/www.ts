#!/usr/bin/env node
// Starting point of the application.
/**
 * Module dependencies.
 */

import app from '../app';
var debug = require('debug')('prism-api:server');
import http from 'http';
import SocketService from '../services/socketService';
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

// Initialize Socket.IO service
const socketService = new SocketService(server);

// Make socket service available globally
app.set('socketService', socketService);
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
