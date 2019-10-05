
const socket = io();  

// Elements
const $form = document.querySelector('#message-form');
const $messageFormInput = $form.querySelector('input');
const $messageFormButton = $form.querySelector('button');
const $sendLocationButton = document.querySelector('#location');
const $messageContainer = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
socket.on('message',message=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{message});
    $messageContainer.insertAdjacentHTML('beforeend',html);
});

socket.on('locationMessage', (locationMessage)=>{
    console.log(locationMessage);
    const html = Mustache.render(locationMessageTemplate,{
        location: locationMessage
    });
    $messageContainer.insertAdjacentHTML('beforeend',html);
});

$form.addEventListener('submit',(event)=>{
    event.preventDefault(); 
    //disable button
    $messageFormButton.setAttribute('disabled','disabled');
    const message = $messageFormInput.value;
    socket.emit('sendMessage',message,(callbackMessage)=>{
        //enable button again
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        console.log(callbackMessage);
    });
    
})

$sendLocationButton.addEventListener('click', (event)=>{
    if(!navigator.geolocation){
        return alert('Location Services not available');
    }
    $sendLocationButton.setAttribute('disabled','disabled');
    navigator.geolocation.getCurrentPosition((position) =>{
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation',{latitude, longitude},(callbackMessage)=>{
            console.log(callbackMessage);
            $sendLocationButton.removeAttribute('disabled');
        })
     });
})

