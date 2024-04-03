const socket = io();
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

window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const uname = params.get('user_name');
    append('you joined the chat', 'middle')
    socket.emit('new_user_joined', uname);
    console.log(uname);
};

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