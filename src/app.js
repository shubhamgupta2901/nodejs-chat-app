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

let count = 0;
//Listening for web socket connections from client
io.on('connection',(socket)=>{
    console.log('New web socket connection');
    socket.emit('init','Web socket connection to backend successful!');
    
    //Registering new event of incrementing count
    socket.on('increment', ()=>{
        count++;
        //when we use socket.emit we emit event to a particular connection.so we use io.emit
        // socket.emit('countUpdated', count);
        io.emit('countUpdated', count);
    })
})


server.listen(port,()=>{
    console.log(`Server is up on port ${port}`);
})