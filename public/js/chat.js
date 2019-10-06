
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

// Options parsing query string
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix: true});
console.log(username, room);

socket.on('message',message=>{
    let {text, createdAt} = message;
    createdAt = moment(createdAt).format('h:mm a');
    const html = Mustache.render(messageTemplate,{text, createdAt});
    $messageContainer.insertAdjacentHTML('beforeend',html);
});

socket.on('locationMessage', (locationMessage)=>{
    let {url, createdAt} = locationMessage;
    createdAt = moment(createdAt).format('h:mm a');
    const html = Mustache.render(locationMessageTemplate,{url, createdAt});
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

socket.emit('join',{username, room});

