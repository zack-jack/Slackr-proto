const express = require('express');
const path = require('path');
const http = require('http');
const socket = require('socket.io');

const { generateMessage } = require('./socket/utils/message');
const { isRealString } = require('./socket/utils/validation');
const { Users } = require('./socket/utils/users');

// Express app setup
const app = express();

// Socket.io setup
const server = http.createServer(app);
const io = socket(server);

const port = process.env.PORT || 5000;
const publicPath = path.join(__dirname, '../client/public');

const users = new Users();

// Serve static files
app.use(express.static(publicPath));

// Listen for connection event
io.on('connection', socket => {
  console.log('New user connected');

  // Listen for user join
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.channel)) {
      return callback('Display name and channel name fields are required');
    }

    // User joins the channel
    socket.join(params.channel);

    // Remove user from the room if they had previously visited
    users.removeUser(socket.id);

    // Add the user to the users list
    users.addUser(socket.id, params.name, params.channel);

    // Update the user list in the proper channel
    io.to(params.channel).emit(
      'updateUserList',
      users.getUserList(params.channel)
    );

    // On connect send only to the new user that joined
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to Slackr!'));

    // On new user join, broadcast message to all other connected users
    socket.broadcast
      .to(params.channel)
      .emit(
        'newMessage',
        generateMessage('Admin', `${params.name} has joined`)
      );

    callback();
  });

  // Listen for messages from client then emit new messages to all
  socket.on('createMessage', ({ from, body }, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(body)) {
      io.to(user.channel).emit('newMessage', generateMessage(user.name, body));
    }

    callback();
  });

  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected');

    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.channel).emit(
        'updateUserList',
        users.getUserList(user.channel)
      );
      io.to(user.channel).emit(
        'newMessage',
        generateMessage('Admin', `${user.name} has left the channel`)
      );
    }
  });
});

// Socket.io is incompatible with app.listen
// using server.listen instead
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
