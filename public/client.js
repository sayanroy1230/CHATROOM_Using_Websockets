const socket = io();
window.onload = function () {
    // Get the query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    // Get the value of the 'name' parameter
    const uname = params.get('user_name');
    // Display the name on the page
    append('you joined the chat', 'middle')
    socket.emit('new_user_joined', uname);
    console.log(uname);
};
const form = document.getElementById('form_container');
const msgio = document.getElementById('messageinp');
const msgcontainer = document.querySelector('.container')
var audio = new Audio('whatsapp.mp3');

const append = (message, position) => {
    const msgelem = document.createElement('div');
    msgelem.innerHTML = message;
    msgelem.classList.add('message');
    msgelem.classList.add(position);
    if (position == 'left' || position == 'right') {
        msgelem.classList.add('messagestyle');
    }
    msgcontainer.append(msgelem);
    if (position == 'left' || position == 'middle') {
        audio.play();
    }
}

function fetchmsg(e) {
    e.preventDefault();
    const message = msgio.value;
    console.log(message);
    append(`You: ${message}`, 'right');
    scrolldown();
    socket.emit('send', message);
    msgio.value = '';
}

function scrolldown() {
    msgcontainer.scrollTop = msgcontainer.scrollHeight;
}

// function fetchname(e) {
//     // e.preventDefault();
//     const user_name = document.getElementById('nameinp').value;
//     append('you joined the chat', 'middle')

//     socket.emit('new_user_joined', user_name);
//     console.log(user_name)
// }
// let user_name;
// do{
//     user_name = prompt("Enter your name to join:");
// }while(!user_name)

// append('you joined the chat', 'middle')
// socket.emit('new_user_joined', user_name);
// console.log(user_name);


socket.on("user_joined", name => {
    append(`${name} joined the chat`, 'middle')
})

socket.on("receive", data => {
    append(`${data.name}:${data.message}`, 'left')
    scrolldown();
})
socket.on("left", name => {
    append(`${name} left the chat`, 'middle')
})