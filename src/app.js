const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

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

io.on('connection',()=>{
    console.log('New web socket connection');
})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
})