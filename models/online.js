var mongoose = require("mongoose");

var OnlineSchema = new mongoose.Schema ({
	id: String,
	username: String
// }, {timestamps: true
});


module.exports = mongoose.model ("Online", OnlineSchema);