let  socket = io();
console.log('I am a client!')

socket.on('user count', (data)=>{
    console.log(data);
})