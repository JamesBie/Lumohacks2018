var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema ({

	username: String,
 	Street: {type: String, default: 'University Drive'},
 	City: {type:String, default: 'Burnaby'},
 	Province: {type:String, default: 'BC'}
// }, {timestamps: true
});


module.exports = mongoose.model ("Profile", ProfileSchema);