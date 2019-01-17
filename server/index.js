const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

// Express app setup
const app = express();

// Socket.io setup
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../client/public');

// Serve static files
app.use(express.static(publicPath));

// Listen for connection event
io.on('connection', socket => {
  console.log('New user connected');

  // On connect send only to the new user that joined
  socket.emit('newMessage', {
    from: 'Admin',
    body: 'Welcome to the channel',
    createdAt: new Date().getTime()
  });

  // On new user join, broadcast message to all other connected users
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    body: 'New user joined',
    createdAt: new Date().getTime()
  });

  // Listen for messages from client then emit new messages to all
  socket.on('createMessage', ({ from, body }) => {
    console.log('createMessage', { from, body });
    io.emit('newMessage', {
      from,
      body,
      createdAt: new Date().getTime()
    });
  });

  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Socket.io is incompatible with app.listen
// using server.listen instead
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
