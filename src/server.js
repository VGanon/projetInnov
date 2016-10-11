var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
app.use(express.static(path.join(__dirname)));

//Requete GET => envoi de "login.html"
app.get('/', function(req, res){
  	res.sendFile(__dirname + '/login.html');
});

//Actif sur le port 3000
http.listen(3000, function(){
  	console.log('listening on *:3000');
});

//Code du serveur
io.on('connection', function(socket){
	socket.on('createAccount', function(data){
		//Connexion a la bdd
		mongo.connect('mongodb://localhost:27017/test', function(err, db) {
			assert.equal(null, err);
			//Tentative d'insertion
			db.collection("users").insertOne(data, function(err, result) {
		    	assert.equal(null, err);
		    	console.log("Successfully added data to database");
		    	//Envoi d'une reponse OKAY au client
		    	io.emit("accountCreated", JSON.stringify(data));
		  	});
		  db.close();
		});
	});
});


