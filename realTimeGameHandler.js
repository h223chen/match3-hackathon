'use strict';

class RealTimeGameHandler {

	constructor(room) {
		// initialize game fields
		var testCount = 0;
		// scoreboard
		var scoreboard = {};

		// initialize
		room.users.forEach(function(user) {
			scoreboard[user.id] = 0;
		});

		// game logic
		room.users.forEach(function(user) {
			var socket = user.socket;

			// initialize game
			socket.emit('gameStart', {
				scoreboard: scoreboard
			});

			// test function			
			socket.on('whatGameRoom', function() {
				socket.emit('whatGameRoom', {"room" : room.id, "testCount" : testCount++});
			});

		  	socket.on('move', function (data) {
			    socket.emit('clientReceive', {
			    	message: "server received your move"
			    });

			    // Calculate score
			    scoreboard[socket.id] += data.numCombos;
			    room.users.forEach(function(user) {
					user.socket.emit('updateScoreboard', {
				    	scoreboard: scoreboard
				    });
			    });  
		  	});
		});
	}
}

module.exports = RealTimeGameHandler;