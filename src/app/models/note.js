// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var noteSchema = mongoose.Schema({

	local			: {
		id_user 	: String,
		id_movie	: String,
		criteres	: {
			"scenario"		: Boolean,
			"jeu_acteurs"	: Boolean,
			"realisation"	: Boolean,
			"bande_son"		: Boolean,
			"ambiance"		: Boolean,
			"lumiere"		: Boolean,
			"montage"		: Boolean,
			"dialogues"		: Boolean,
			"decors"		: Boolean,
			"costumes"		: Boolean,
			"narration"		: Boolean,
			"rythme"		: Boolean,
			"sfx"			: Boolean
		}
	}

}, { strict: false} );

// create the model for users and expose it to our app
module.exports = mongoose.model('Note', noteSchema);
