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

io.on('connection', socket => {
  console.log('New user connected');

  socket.on('createMessage', ({ from, body }) => {
    console.log('createMessage', { from, body });
    io.emit('newMessage', {
      from,
      body,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Socket.io is incompatible with app.listen
// using server.listen instead
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
