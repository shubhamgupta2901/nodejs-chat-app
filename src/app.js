const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const  {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users');
const filter = new Filter();
 
/**
 * Changing the way we create a web server with express.
 * This work of creating http server is done by express under the hood, we are it explicitly to use socket.io as well
 * Socket.io expects to be called with raw http server. When express creates it behind the scene we don't have access to it 
 * to pass it in socketio constructor.
 * Now our http server supports web sockets too.
 * 
 */
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 3000;

const publicDirectoryPath = path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

// let count = 0;
//Listening for web socket connections from client
io.on('connection',(socket)=>{
    console.log('New Client connected. id: ', socket.id);
    
    socket.on('join',({username, room}, callback)=>{
        const {error, user} = addUser({id: socket.id,username, room});
        if(error){
            console.log(error);
            socket.emit('message', generateMessage(error));
            callback(error);
            return;
        }
        socket.join(user.room);
        socket.emit('message',generateMessage(`Welcome to ${user.room} room!`));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined chat.`));
    });

    socket.on('sendMessage',(message, callback)=>{
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed');
        }
        const user = getUser(socket.id);
        if(!user){
            callback(`Not delivering message.`)
        }
        io.to(user.room).emit('message',generateMessage(message));
        callback('message delivered');
    });

    socket.on('sendLocation',({latitude, longitude}, callback)=>{
        const user = getUser(socket.id);
        if(!user){
            callback(`Not delivering message.`)
        }
        io.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`));
        callback('Location shared');
    });

    socket.on('disconnect', ()=>{
        const {error, user} = removeUser(socket.id);
        if(error){
            console.log('disconnect',error);
            return;
        }
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has left.`));
    });
    
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
})