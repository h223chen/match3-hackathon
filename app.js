var express = require('express');
var os = require('os');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
app.use('/assets', express.static(__dirname + '/assets'));

var Room = require('./room.js');
var User = require('./user.js');
var RealTimeGameHandler = require('./realTimeGameHandler.js');

// constants
const ROOM_SIZE = 2;


// roomId -> Room
var rooms = {};
var roomIndex = 1;
// socketId -> User;
var connectedUsers = {};
var matchmakingQueue = [];

function setupConnection(socket) {
	var user = new User(socket);
	connectedUsers[socket.id] = user;
	console.log(user.id + " connected.");

	// add to queue and create rooms
	matchmakingQueue.push(user);
	if (matchmakingQueue.length >= ROOM_SIZE) {
		var roomUsers = matchmakingQueue.slice(0, ROOM_SIZE);
		var room = new Room(roomIndex, roomUsers);

		var gameHandler = new RealTimeGameHandler(room);
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

var ifaces = os.networkInterfaces();
app.use('/assets', express.static(__dirname + '/assets'));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on localhost:'+server.address().port);
});

// getting network interfaces
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log("Listening on (" + alias + ") " + iface.address + ":" + server.address().port);
    } else {
      // this interface has only one ipv4 adress
      console.log("Listening on " + iface.address + ":" + server.address().port);
    }

    ++alias;
  });
});

// ============================================================



io.on('connection', function (socket) {
	setupConnection(socket);
});
