
const socket = io();  

const form = document.querySelector('form');
const messageInput = document.querySelector('#message');
const sendLocationButton = document.querySelector('#location');

form.addEventListener('submit',(event)=>{
    event.preventDefault(); 
    const message = messageInput.value;
    if(message){
        socket.emit('sendMessage',message,(callbackMessage)=>{
                console.log(callbackMessage);
        });
    }
})

sendLocationButton.addEventListener('click', (event)=>{
    if(!navigator.geolocation){
        return alert('Location Services not available');
    }
    navigator.geolocation.getCurrentPosition((position) =>{
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude);
        socket.emit('sendLocation',{latitude, longitude},(callbackMessage)=>{
            console.log('Location shared!');
        })
     });
})

socket.on('message',message=>{
    console.log(message);
});