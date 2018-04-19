var express = require('express')
var app = express()

var server = require('http').Server(app)

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/client/index.html')
})

app.use('/client', express.static(__dirname + '/client'))

// Listen on Port 2000
server.listen(process.env.PORT || 2000)
console.log('Server Started')

// IO connection
var io = require('socket.io')(server, {})

// Game Server
function Client(socketId, name, playerId) {
    this.name = name
    this.socketId = socketId
    this.playerId = playerId
    this.setPlayerId = function(id) {
        var validIds = [0, 1, -1] // -1 viewer, 0 paddle left, 1 paddle right
        if (validIds.indexOf(id) >= 0) { this.playerId = id}
        else { this.playerId = -1 }
    }
    this.setPlayerId(playerId)
}

var clients = []

function requestFreePlayer() {
    // Todo: find first free player
    if (getPlayerById(0) === undefined) return 0
    else if (getPlayerById(1) === undefined) return 1
    else return -1
}

function getPlayerById(id) {
    return clients.find(x => x.playerId === id)
}

function getPlayerBySocketId(id) {
    return clients.find(x => x.socketId === id)
}


// Listen for a connection request from any client
io.sockets.on('connection', function(socket) {
    console.log('Socket connected: ', socket.id)

    socket.on('request_player', function(name, fn){
        var client = new Client(socket.id, name, requestFreePlayer())
        clients.push(client)
        fn(client.playerId)
    })

    socket.on('disconnect', function() {
        console.log('Player disconnected!', socket.id)
        clients.splice(clients.indexOf(getPlayerBySocketId(socket.id)),1)
        // Todo
        // - if player available - broadcast player available event
    })
})