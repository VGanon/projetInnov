// load up the user model
var User = require('./models/user');
var Note = require('./models/Note');

// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	app.get('/testAlgo', function(req,res) {
	  res.render('algo.ejs');
	});
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// HOME SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/home', isLoggedIn, function(req, res) {
		res.render('home.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});


	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {

		Note.find({'id_user': req.user._id}).lean().exec(function (err, note) {
		    var movies = JSON.stringify(note);

		    res.render('profile.ejs', {
				user: req.user, // get the user out of session and pass to template
				movies: movies,
				message: ""
			});
		});
		
	});



	// =====================================
	// CONFIGURE PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/configure', isLoggedIn, function(req, res) {
		res.render('configure.ejs', {
			user : req.user, // get the user out of session and pass to template
			message: null
		});
	});

	//User update
	app.post('/configure', isLoggedIn, function(req, res) {
		//Errors
		if(!req.body.username || !req.body.email){
			message = 'Veuillez remplir les champs obligatoires !';
			res.render('configure.ejs', {
				user: req.user, // get the user out of session and pass to template
				message: 'Veuillez remplir les champs obligatoires !'
			});
		} else if(req.body.newPassword !== req.body.confirmNewPassword){
			res.render('configure.ejs', {
				user: req.user, // get the user out of session and pass to template
				message: 'La confirmation du nouveau mot de passe est incorrecte !'
			});
		} 

		//No errors
		else {
			//Update data in base
			User.findOne({'_id': req.user._id}, function(err, user){
				// password = newPassword only if newPassword not empty
				var pass = user.generateHash(req.body.newPassword);
				if(err) return done(err);
				//Update
				if(!req.body.newPassword && !req.body.confirmNewPassword) {
					pass = user.local.password;
				}
				user.local = {
					'username': req.body.username,
					'password': pass,
					'email': req.body.email,
					'categories': req.body.categories
				};
				//Save
				user.save(function(){
					//Relog mandatory to reload from base
					req.login(user, function(err) {
				        if (err) return next(err);

				        res.render('profile.ejs', {
							user: req.user, 
							message: 'Vos informations ont été modifiées'
						});
				    });
				});
			});
		}
	});



	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	// =====================================
	// MOVIE ===============================
	// =====================================
	app.get('/movie/:id', isLoggedInToLogin, function(req, res){
		if (isNaN(parseInt(req.params.id, 10)) || parseInt(req.params.id, 10) < 0) res.redirect('/home');
		else res.render('movie.ejs', {id: req.params.id});
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function isLoggedInToLogin(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
