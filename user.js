class User {
	// a User's id is their socketId
	constructor(socketId) {
		this.id = socketId;
	}
};

module.exports = User;