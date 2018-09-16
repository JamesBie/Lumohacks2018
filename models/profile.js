var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema ({

	username: String,
 	street: {type: String, default: 'University Drive'},
 	city: {type:String, default: 'Burnaby'},
 	province: {type:String, default: 'BC'},
 	latitude: Number,
 	longitude: Number

// }, {timestamps: true
});


module.exports = mongoose.model ("Profile", ProfileSchema);