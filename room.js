'use strict';

class Room {

	constructor(id, users) {
		this.id = id;
		this.users = users;
		this.users.forEach(u => u.roomId = id);

		// set when user joins a room
		this.roomId = null;
		this.gameHandler = null;
	}

	// removes user from this room.
	kickUser(userId) {
		this.users = this.users.filter(u => u.id != userId);
	}
};

module.exports = Room;