const socket = io();

// Listen for connection to the server
socket.on('connect', () => {
  console.log('Connected to server');
});

// Listen for server disconnect
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Listen for new message from server
socket.on('newMessage', message => {
  console.log('New message', message);
});
