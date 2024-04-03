const express = require("express");
const http = require("http");
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000
// $env:PORT = 8800 ->run this in powershell
const server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.get('/chatroom', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chatbox.html'));
})

const users = {};

io.on("connection", socket => {
    socket.on("new_user_joined", name => {
        users[socket.id] = name;
        socket.broadcast.emit("user_joined", name);
    });
    socket.on('send', message => {
        socket.broadcast.emit("receive", { message: message, name: users[socket.id] })
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit("left", users[socket.id]);
        delete users[socket.id];
    });
})
server.listen(PORT, () => {
    console.log("running!");
});

