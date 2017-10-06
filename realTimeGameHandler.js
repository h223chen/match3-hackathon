'use strict';

class RealTimeGameHandler {

	constructor(room) {
		// initialize game fields
		var testCount = 0;
		var running = true;
		var scoreboard = {};

		var GAME_LENGTH = 60000;
		var SCORE_MULTIPLIER = 50;

		// initialize
		room.users.forEach(function(user) {
			scoreboard[user.id] = 0;
		});

		// game logic
		room.users.forEach(function(user) {
			var socket = user.socket;

			// initialize game
			socket.emit('gameStart', {
				scoreboard: scoreboard,
				gameLength: GAME_LENGTH
			});

			// test function			
			socket.on('whatGameRoom', function() {
				socket.emit('whatGameRoom', {"room" : room.id, "testCount" : testCount++});
			});

		  	socket.on('move', function (data) {
		  		if (running) {
				    // Calculate score
				    var colorScore = 0;
				    Object.keys(data.colorMap).forEach(function(colorKey) {
				    	colorScore += data.colorMap[colorKey];
				    });

				    scoreboard[socket.id] += (data.numCombos * colorScore * SCORE_MULTIPLIER);
				    room.users.forEach(function(user) {
				    	// Update scoreboard
						user.socket.emit('updateScoreboard', {
					    	scoreboard: scoreboard
					    });

				    	// Send attacks to other players
					    if (data.attackConditionFulfilled && socket.id != user.socket.id) {
					    	user.socket.emit('frozenRequest', {
					    		attackStrength: 2
					    	});
					    }
				    });


				}
		  	});
		});
		
		// Game has finite length
		setTimeout(function() {
			console.log("Room #" + room.id + " game ended");
			running = false;
			room.users.forEach(function(user) {
				user.socket.emit('gameEnd', {
					scoreboard: scoreboard
				});
			});
		}, GAME_LENGTH);
	}
}

module.exports = RealTimeGameHandler;