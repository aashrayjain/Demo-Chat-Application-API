const express = require('express');
const http = require('http');
const socket = require('socket.io');

let app = express();
let httpServer = http.Server(app);

let io = socket(httpServer, {
    cors: {
        origin: "http://localhost:8100",
        credentials: true
    }
});

 
io.on('connection', (socket) => {

    console.log(socket.id);
    socket.on('disconnect', function(){
        console.log('Disconnect');
        io.emit('users-changed', {user: socket.nickname, event: 'left'});   
    });
    
    socket.on('set-nickname', (nickname) => {
        socket.nickname = nickname;
        console.log(socket.nickname);
        io.emit('users-changed', {user: socket.nickname, event: 'joined'});    
    });
    
    socket.on('add-message', (message) => {
        console.log(message);
        io.emit('message', {text: message.text, from: socket.nickname, created: new Date()});    
    });
});
 
var port = process.env.PORT || 3001;
 
httpServer.listen(port, function(){
   console.log('listening in http://localhost:' + port);
});