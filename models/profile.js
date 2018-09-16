var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var ProfileSchema = new mongoose.Schema ({

	username: String,
	password: String,
 	street: {type: String, default: 'University Drive'},
 	city: {type:String, default: 'Burnaby'},
 	province: {type:String, default: 'BC'},
 	latitude: Number,
 	longitude: Number

// }, {timestamps: true
});

ProfileSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model ("Profile", ProfileSchema);