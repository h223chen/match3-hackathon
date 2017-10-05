var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
app.use('/assets', express.static(__dirname + '/assets'));
var fs = require('fs');

// constants
const ROOM_SIZE = 2;

var rooms = [];
var matchmakingQueue = [];
var connectedSocketIds = [];

function setupConnection(socket) {
	connectedSocketIds.push(socket.id);
	console.log(socket.id + " connected.");

	// add to queue
	matchmakingQueue.push(socket.id);
	if (matchmakingQueue.length >= ROOM_SIZE) {
		matchmakingQueue.splice(0, ROOM_SIZE);
	}

	// disconnect logic
	socket.on('disconnect', function() {
	  console.log(socket.id + " disconnected.");
	  connectedSocketIds.splice(connectedSocketIds.indexOf(socket.id), 1);
	});
}

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection', function (socket) {
	setupConnection(socket);

  socket.on('move', function (data) {
    console.log(data);
    socket.emit('clientReceive', {message: "server received your move"});
  });
});
