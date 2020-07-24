const express = require('express');
const http = require('http'); // used by express to create server
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages'); // Convert strings to objects
const {userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app); // needed for Socket.io
const io = socketio(server); 

// Set static folder - use __dirname for current directory
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot'; // Username for formatMessage() if no username

// Run when client connects
io.on('connection', socket => {
    // console.log('New Web Socket Connection...'); //io.on listens for an event called connection using socketio

    // io.emit send to all
    // socket.emit sends to user
    // socket.broadcast.emit sends to all except user

    socket.on('joinRoom', ({ username, room }) => {
        // Pulls user data and places it in var user
        const user = userJoin(socket.id, username, room); // socket.id is used in place of id 

        // Joins to room from whatever room user picks
        socket.join(user.room);

        // Send message event when connected - go to public/js/main.js to catch event message
        socket.emit('message', formatMessage(botName, 'Welcome to the Chat!'));

        // Broadcast when user connects - .broadcast emits to all except user that connects
        // use .to(user.room) to emit message only to users in specific room
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
      );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage from main.js
    socket.on('chatMessage', msg => {
        // Pull username from user
        const user = getCurrentUser(socket.id);

        // Broadcasts message to all users
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    // Run when client disocnnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
              );
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
}); 

const PORT = process.env.PORT || 3000;

server.listen(PORT,
     () => console.log(`Server running on port ${PORT}`)
);