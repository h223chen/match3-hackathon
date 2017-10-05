class TurnBasedGameHandler {
	constructor(io, socket, room) {
		room.users.forEach(function(user) {
			io.to(user.id).emit('clientReceive', "Game starting in room " + room.id);
		});
	}
}

module.exports = TurnBasedGameHandler;