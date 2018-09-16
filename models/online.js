var mongoose = require("mongoose");

var OnlineSchema = new mongoose.Schema ({

	username: String
// }, {timestamps: true
});


module.exports = mongoose.model ("Online", OnlineSchema);