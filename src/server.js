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
//var apriori = require('apriori');
var io = require('socket.io')(http);
var configDB = require('./config/database.js');
var fs = require('fs');
var User = require('./app/models/user');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

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