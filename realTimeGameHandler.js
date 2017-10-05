'use strict';

class RealTimeGameHandler {

	constructor(room) {
		// hack to get gamehandler fields within socket scope
		var game = this;
		// initialize game fields
		this.testCount = 0;

		// game logic
		room.users.forEach(function(user) {
			var socket = user.socket;

			// initialize game
			socket.emit('gameStart', 'gameStart');


			// test function			
			socket.on('whatGameRoom', function() {
				socket.emit('whatGameRoom', {"room" : room.id, "testCount" : game.testCount++});
			});
		});
	}
}

module.exports = RealTimeGameHandler;