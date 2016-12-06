// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();

var http     = require('http').createServer(app);

var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var apriori = require('apriori');
var io = require('socket.io')(http);
var configDB = require('./config/database.js');

http.listen(port, "127.0.0.1");
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
//Code du serveur


require('./config/passport')(passport); // pass passport for configuration

app.use('/js', express.static('./js'));
app.use('/css', express.static('./css'));
app.use('/core', express.static('./core'));
app.use('/node_modules', express.static('./node_modules'));
app.use('/img', express.static('./img'));

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'html'); // set up html for templating

	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('Listening on port : ' + port);

//var noteSchema = ;
io.on('connection', function(socket){

  socket.on('getNotes', function(data){
		console.log(data);
    if(data === "all"){
      mongoose.connect('mongodb://localhost:27017/moviesbestchoice', function(err) {
				if (err) { throw err; }
				/*var NoteModel = mongoose.model('note', commentaireArticleSchema);
        db.collection('note').find({}).sort({user_id : 1}).toArray(function(err, res){
          socket.emit('getNotes', res);
        });*/
      });
    }
  });
  socket.on('buildCSV', function(data){
    fs.writeFile("./tmp/data.csv", data, 'utf8', function(err) {
    if(err) {
        return console.log(err);
    }
    /*fs.readFile('./tmp/data.csv', 'utf8', function (err, csv) {
        var transactions = apriori.ArrayUtils.readCSVToArray(csv);
        var aprioriAlgo = new apriori.Algorithm(0.05, 0.05,false);
        var result = aprioriAlgo.analyze(transactions);
        console.log(transactions);
        socket.emit("aprioriResults", result.associationRules);
    });*/

  });
  new apriori.Algorithm(1, 1, true).showAnalysisResultFromFile('./tmp/data.csv');
  });
});
