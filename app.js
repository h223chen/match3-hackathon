var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
app.use('/assets', express.static(__dirname + '/assets'));
var fs = require('fs');
var Room = require('./room.js');
var User = require('./user.js');
var TurnBasedGameHandler = require('./turnBasedGameHandler.js');

// constants
const ROOM_SIZE = 2;


// roomId -> Room
var rooms = {};
var roomIndex = 1;
// socketId -> User;
var connectedUsers = {};
var matchmakingQueue = [];


function setupConnection(socket) {
	var user = new User(socket.id);
	connectedUsers[socket.id] = user;
	console.log(user.id + " connected.");

	// add to queue and create rooms
	matchmakingQueue.push(user);
	if (matchmakingQueue.length >= ROOM_SIZE) {
		var roomUsers = matchmakingQueue.slice(0, ROOM_SIZE);
		var room = new Room(roomIndex, roomUsers);

		var gameHandler = new TurnBasedGameHandler(io, socket, room);
		room.gameHandler = gameHandler;

		rooms[room.id] = room;
		matchmakingQueue.splice(0, ROOM_SIZE);
		console.log("Created room #" + roomIndex + " with users " + roomUsers.map(u => u.id));
		roomIndex++;
	}

	// disconnect logic
	socket.on('disconnect', function() {
	  var user = connectedUsers[socket.id];

	  // delete user from room
	  if (user.roomId in rooms) {
	  	rooms[user.roomId].kickUser(user.id);
	  }

	  delete connectedUsers[user.id];
	  console.log(user.id + " disconnected.");	  
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
