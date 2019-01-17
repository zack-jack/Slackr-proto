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
socket.on('newMessage', ({ from, body, createdAt }) => {
  const formattedTime = moment(createdAt).format('h:mm a');

  let li = jQuery('<li></li>');
  li.text(`${from} ${formattedTime}: ${body}`);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();

  const messageInput = jQuery('[name=message]');

  socket.emit(
    'createMessage',
    {
      from: 'User',
      body: messageInput.val()
    },
    () => {
      messageInput.val('');
    }
  );
});
