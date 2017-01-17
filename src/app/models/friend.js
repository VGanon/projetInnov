// load the things we need
var mongoose = require('mongoose');

// define the schema for our model
var friendSchema = mongoose.Schema({
	local: {
		id_user: String,
		friends: []
	}

}, { strict: false} );

// create the model for users and expose it to our app
module.exports = mongoose.model('Friend', friendSchema);
