const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));



io.on('connection', (socket) => {
    console.log(`New websocket connection`);

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser( {id: socket.id, username, room });

        if (error) {
            return callback(error)
        }

        socket.join(user.room);

        socket.emit('message', generateMessage(user.room, 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage(user.room, `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('sendMessage', (content, callback) => {
        const user = getUser(socket.id); 

        const filter = new Filter();

        if(filter.isProfane(content)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, content));
        callback();
    }); 

    // let count = 0; (declared outside before commenting)

    // socket.emit('countUpdated', count);

    // socket.on('increment', () => {
    //     count++;
    //     // socket.emit('countUpdated', count); - only does it for the one connection and not all
    //     io.emit('countUpdated', count);
    // })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);

        if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number' ) {
           return callback ('Please confirm location again!')
        }
        
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage(user.room, `${user.username} has left`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        };
    });
});



server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});