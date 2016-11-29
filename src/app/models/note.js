// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var noteSchema = mongoose.Schema({
	
	local			: {
		id_user 	: String,
		id_movie	: String,
		criteres	: {"Scénario": Boolean, "Jeu d’acteurs": Boolean, "Réalisation": Boolean, "Bande son": Boolean, "Ambiance": Boolean, "Lumière": Boolean, "Montage": Boolean, "Dialogues": Boolean, "Décors": Boolean, "Costumes": Boolean, "Narration": Boolean, "Rythme": Boolean, "SFX" :Boolean}
	}
	
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Note', noteSchema);