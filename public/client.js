let  socket = io();
console.log('I am a client!')

socket.on('user', (data)=>{
    console.log(data);
})

const p = document.querySelector('#msg');

socket.on('announce message', (data)=>{
    p.textContent = data.message;
})

const form = document.querySelector('form');
const msg = document.querySelector('#m');

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    socket.emit('chat message', {
        message: msg.value
    });
})

