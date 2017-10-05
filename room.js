class Room {
	constructor(id, users) {
		this.id = id;
		this.users = users;
		this.users.forEach(u => u.roomId = id);
	}

	// removes user from this room.
	kickUser(userId) {
		this.users = this.users.filter(u => u.id != userId);
	}
};

module.exports = Room;