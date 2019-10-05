
const socket = io();  

//Listening to init event
socket.on('init', (message)=> {
    console.log(message);
})

// Listening to countUpdated event.
socket.on('countUpdated',(count)=>{
    console.log('The count has been updated', count);
});

//triggering increment event on button click
document.querySelector('#increment').addEventListener('click',()=>{
    console.log('Button Clicked');
    socket.emit('increment');
})  