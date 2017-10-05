class User {
	// a User's id is their socketId
	constructor(socket) {
		this.socket = socket;
		this.id = socket.id;
	}
};

module.exports = User;