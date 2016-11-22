var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
app.use(express.static(path.join(__dirname)));

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

//Requete GET => envoi de "login.html"
app.get('/', function(req, res){
  	res.sendFile(__dirname + '/login.html');
});

/*app.get('/getUpcomingMovies', function(req, res){
  	res.sendFile(__dirname + '/core/APIRequests/upcomingMovies.html');
});*/

app.get('/login', function(req, res){
  	res.sendFile(__dirname + '/login.html');
});

app.get('/subscribe', function(req, res){
  	res.sendFile(__dirname + '/createAccount.html');
});

app.get('/index', function(req, res){
  	res.sendFile(__dirname + '/index.html');
});

app.get('/home', function(req, res){
  	res.sendFile(__dirname + '/home.html');
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
			var errorMessage = "";
			//console.log(db.collection("users").find({'email': data.email}).count());
			if(data.username == "") {
				errorMessage = "Saisir un nom d'utilisateur est obligatoire !";
			} else if(data.email == "") {
				errorMessage = "Saisir une adresse mail est obligatoire !";
			} else if(data.password == "") {
				errorMessage = "Saisir un mot de passe est obligatoire !";
			} else if(data.password =! data.confirmPassword) {
				errorMessage = "Le mot de passe n'est pas identique !";
			}
			
			/*db.collection("users").find({'email': data.email}).count().then(function(numItems) {
				console.log(numItems);
				errorMessage = "Il existe déjà un compte avec cette adresse mail !";
				io.emit("accountCreationFailed", errorMessage);
			})
			
			db.collection("users").find({'username': data.username}).count().then(function(numItems) {
				console.log(numItems);
				errorMessage = "Le nom d'utilisateur existe déjà !";
				io.emit("accountCreationFailed", errorMessage);
				
			})*/
			
			if(errorMessage == "") {
				//Tentative d'insertion
				var user = {"username": data.username, "email": data.email, "password": data.password, "sexe": data.sexe, "birthday": data.birthday, "categories": data.categories};
				db.collection("users").insertOne(user, function(err, result) {
					assert.equal(null, err);
					console.log("Successfully added data to database");
					//Envoi d'une reponse OKAY au client
					io.emit("accountCreated", JSON.stringify(data));
				});
			} else {
				io.emit("accountCreationFailed", errorMessage);
			}
			
		  db.close();
		});
	});
	
	socket.on('login', function(data){
		var errorMessage = "";
			//console.log(db.collection("users").find({'email': data.email}).count());
			if(data.email == "" || data.password == "") {
				errorMessage = "Email ou mot de passe incorrect !";
			}
		
			if(errorMessage == "") {
				//Tentative de connexion
				io.emit("loggingIn", JSON.stringify(data));
			} else {
				io.emit("loginFailed", errorMessage);
			}
		
	});

	
});
