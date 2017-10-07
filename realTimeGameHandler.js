'use strict';

class RealTimeGameHandler {

	constructor(room) {
		// initialize game fields
		var testCount = 0;
		var running = true;
		// both userid key'd
		var scoreboard = {};
		var userNames = {};
		var playersReady = 1;

		var GAME_LENGTH = 150000 + 2000; // 2 second buffer
		var SCORE_MULTIPLIER = 50;

		// initialize
		room.users.forEach(function(user) {
			scoreboard[user.id] = 0;
			userNames[user.id] = user.name;
		});

		// game logic
		room.users.forEach(function(user) {
			var socket = user.socket;

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
					    	if (data.attackCondition === 'rows' || data.attackCondition === 'columns') {
						    	user.socket.emit('mustDisolveRequest', {
						    		attackStrength: 1
						    	});
					    	}
					    	else {
					    		user.socket.emit('frozenRequest', {
						    		attackStrength: 2
						    	});
					    	}
					    }
				    });
				}
		  	});

			socket.on('ready', function() {
				console.log("ready");
				playersReady++;
				if (playersReady === 2) {
					// start game, wait one second to let user finish rendering phaser, set timeout for game end
					room.users.forEach(function(user) {
						var socket = user.socket;
						socket.emit('gameStart', {
							scoreboard: scoreboard,
							gameLength: GAME_LENGTH,
							names: userNames
						});
					});
					//  Game has finite length
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
			});
		});	
	}
}

module.exports = RealTimeGameHandler;