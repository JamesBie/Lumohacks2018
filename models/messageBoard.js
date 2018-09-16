var mongoose = require("mongoose");

var messageBoard = new mongoose.Schema ({
	id: String,
	username: String,
	message: String
});

module.exports = mongoose.model ("messageboard", messageBoard);