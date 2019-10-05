
const socket = io();  

const form = document.querySelector('form');
const messageInput = document.querySelector('input');

form.addEventListener('submit',(event)=>{
    event.preventDefault(); 
    const message = messageInput.value;
    if(message){
        socket.emit('sendMessage',message);
    }
})

socket.on('message',message=>{
    console.log(message);
})