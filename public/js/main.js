const chatForm = document.getElementById('chat-form'); // Put chat-form from html into var
const chatMessages = document.querySelector('.chat-messages'); // Grab div with class of chat-messages
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true // ignores query chars like ?#&
});

const socket = io();

// Sends joinroom event using query selectors of username and room 
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomname(room);
  outputUsers(users);
})


// catches message event from io.on in server.js
socket.on('message', message => {
  console.log(message);
  outputMessage(message); // Sends message from server to DOM - skip to functoin

  // Scroll down by making top of div equal height of container
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit message to server
chatForm.addEventListener('submit', e =>{
  // Prevents default behavior of form
  e.preventDefault();

  // Get text value from element with id of msg
  const msg = e.target.elements.msg.value;

  // Emit message to server - use mssg as payload
  // Sends chatMessage event to server
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';

  // Focuses typing cursor on empty form
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message){
  const div = document.createElement('div');

  // Attach class name 'message' to new div
  div.classList.add('message');

  // HTML inside div message - add {message.text} to p - username, time and text provided by formatMessage()
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  // Finds chat-messages container div - add new div element to container
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomname(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}