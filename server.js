// external imports
const http = require('http');
const { Server } = require('socket.io');
const Emitter = require('events');

// internal imports
const app = require('./app');
const { logger } = require('./app/http/middleware/common/logger');

// init port
const PORT =
  process.env.PORT && process.env.NODE_ENV === 'production'
    ? process.env.PORT
    : 3000;

// init server
const server = http.createServer(app);

// init socket
const io = new Server(server);

// set event emitter
const eventsEmitter = new Emitter();
app.set('eventsEmitter', eventsEmitter);

io.on('connection', (socket) => {
  // join to the room
  socket.on('join', (roomName) => {
    socket.join(roomName);
  });
});

// update order status ui for customer in real-time
eventsEmitter.on('orderStatusUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderStatusUpdated', data);
});

// update admin ui for a new order in real-time
eventsEmitter.on('orderPlaced', (data) => {
  io.to('adminRoom').emit('orderPlaced', data);
});

// server listening
server.listen(PORT, () => {
  logger.debug(`Server listening at http://localhost:${PORT}`);
});
