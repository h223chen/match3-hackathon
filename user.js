'use strict';

class User {
	// a User's id is their socketId
	constructor(socket) {
		this.socket = socket;
		this.id = socket.id;
		this.name = socket.handshake.query.name;
		if (!this.name) {
			this.name = "Anonymous";
		} 
	}
};

module.exports = User;