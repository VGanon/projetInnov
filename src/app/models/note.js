// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var noteSchema = mongoose.Schema({
	
	local			: {
		id_user 	: int,
		id_movie	: int,
		criteres	: {"Scénario": int, "Jeu d’acteurs": int, "Réalisation": int, "Bande son": int, "Ambiance": int, "Lumière": int, "Montage": int, "Dialogues": int, "Décors": int, "Costumes": int, "Narration": int, "Rythme": int, "SFX" :int}
	}
	
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Note', noteSchema);