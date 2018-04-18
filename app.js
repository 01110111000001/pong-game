var express = require('express');
var app = express();

var server = require('http').Server(app);

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/client/index.html')
});

app.use('/client', express.static(__dirname + "/client"));

// Listen on Port 2000
server.listen(process.env.PORT || 2000);
console.log("Server Started");

// IO connection
var io = require('socket.io')(server, {});

// Listen for a connection request from any client
io.sockets.on('connection', function(socket) {
    console.log("Socket connected: ", socket.id);
//asdhasdsa
    socket.on('request_player', function(name, fn){
        console.log("Requested Player: ", socket.id);
        fn(name);
    });

    socket.on('disconnect', function() {
        console.log('Got disconnected!', socket.id);
    });
});