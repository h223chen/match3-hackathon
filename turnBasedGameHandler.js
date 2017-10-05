class TurnBasedGameHandler {
	constructor(io, socket, room) {
		room.users.forEach(function(user) {
			socket.broadcast.to(user.id).emit('clientReceive', "Game starting in room " + room.id);
		});
	}
}

module.exports = TurnBasedGameHandler;