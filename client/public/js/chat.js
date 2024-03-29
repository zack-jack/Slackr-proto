const socket = io();

// Autoscroll
const scrollToBottom = () => {
  // Selectors
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');

  // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
};

// Listen for connection to the server
socket.on('connect', () => {
  // Pulls query string and turns key values into an object
  const params = jQuery.deparam(window.location.search);

  // Listen for a join event and pass params
  socket.emit('join', params, err => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

// Listen for server disconnect
socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

//Listen for user list changes
socket.on('updateUserList', users => {
  const ol = jQuery('<ol></ol>');

  users.forEach(user => {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

// Listen for new message from server
socket.on('newMessage', ({ from, body, createdAt }) => {
  const formattedTime = moment(createdAt).format('h:mm a');
  const template = jQuery('#message-template').html();
  const html = Mustache.render(template, {
    from,
    body,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', e => {
  e.preventDefault();

  const messageInput = jQuery('[name=message]');

  socket.emit(
    'createMessage',
    {
      body: messageInput.val()
    },
    () => {
      messageInput.val('');
    }
  );
});
