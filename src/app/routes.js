// load up the user model
var User = require('./models/user');
var Note = require('./models/note');

// function to check if an email is valid
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// function to check if a password is valid
function validatePassword(password) {
  var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/;
  return re.test(password);
}

// app/routes.js
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
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
    Note.find(null).sort([['local.id_user', 'ascending']]).exec(function (err,notes) {
      var notes = JSON.stringify(notes);
      res.render('home.ejs', {
        notes: notes,
        userId: req.user._id,
        user : req.user // get the user out of session and pass to template
      });
    });
  });


  // =====================================
  // PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    Note.find({'local.id_user': req.user._id}).lean().exec(function (err, note) {
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

    else {

      User.findOne({'_id': req.user._id}, function(err, user){
        // password = newPassword only if newPassword not empty
        var pass = user.generateHash(req.body.newPassword);
        if(err) return done(err);

        if(!req.body.newPassword && !req.body.confirmNewPassword) {
          pass = user.local.password;
        }



        User.findOne({'local.username': req.body.username}, function(err, username){
          //  if new username exists already (but not current user)
          if(username && (req.body.username !== req.user.local.username)) {
            res.render('configure.ejs', {
              user: req.user,
              message: 'Le nom d\'utilisateur est déjà utilisé !'
            });

          } else if(req.body.username.length > 10) {
            // if username invalid
            res.render('configure.ejs', {
              user: req.user,
              message: 'Le nom d\'utilisateur ne doit pas dépasser 10 caractères !'
            });


          } else if(!validateEmail(req.body.email)) {
            // if email format is invalid
            res.render('configure.ejs', {
              user: req.user,
              message: 'L\' adresse email est invalide !'
            });

          } else if(req.body.newPassword && !validatePassword(req.body.newPassword)) {
            // if password is invalid
            res.render('configure.ejs', {
              user: req.user,
              message: 'Le mot de passe doit contenir au moins 8 caractères, au moins une lettre majuscule, une lettre miniscule et un chiffre !'
            });

          } else {

            User.findOne({'local.email': req.body.email}, function(err, email){
              // if email exists
              if(email  && (req.body.email !== req.user.local.email)) {
                res.render('configure.ejs', {
                  user: req.user,
                  message: 'L\' adresse email est déjà utilisée !'
                });
              } else {

                // No errors => update
                user.local = {
                  'username': req.body.username,
                  'password': pass,
                  'email': req.body.email,
                  'categories': req.body.categories
                };
                // Save
                user.save(function(){
                  //Relog mandatory to reload from base
                  req.login(user, function(err) {
                    if (err) return next(err);

                    Note.find({'id_user': req.user._id}).lean().exec(function (err, note) {
                      var movies = JSON.stringify(note);

                      res.render('profile.ejs', {
                        user: req.user, // get the user out of session and pass to template
                        movies: movies,
                        message: 'Les informations de l\'utilisateur ont été modifiées avec succès !'
                      });
                    });
                  });
                });
              }

            });

          }


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
    else {
		Note.findOne({'local.id_user' : req.user._id, 'local.id_movie' : req.params.id}, function(err, notes){
			if (notes){
				res.render('movie.ejs', {
					user : req.user, // get the user out of session and pass to template
					id: req.params.id,
					criteres: JSON.stringify(notes.local.criteres)
			});
			}
			else {
				res.render('movie.ejs', {
					user : req.user, // get the user out of session and pass to template
					id: req.params.id,
					criteres: "null"
				});
			}
		});
	}
  });

  app.post('/movie/:id', isLoggedInToLogin, function(req, res){

		Note.findOne({'local.id_user' : req.user._id, 'local.id_movie' : req.params.id}, function(err, notes)
		{
			var note;
			if(notes)
			{
				notes.local.criteres = {
					"scenario"		: JSON.parse(req.body.scenario),
					"jeu_acteurs"	: JSON.parse(req.body.jeu_acteurs),
					"realisation"	: JSON.parse(req.body.realisation),
					"bande_son"		: JSON.parse(req.body.bande_son),
					"ambiance"		: JSON.parse(req.body.ambiance),
					"lumiere"		: JSON.parse(req.body.lumiere),
					"montage"		: JSON.parse(req.body.montage),
					"dialogues"		: JSON.parse(req.body.dialogues),
					"decors"		: JSON.parse(req.body.decors),
					"costumes"		: JSON.parse(req.body.costumes),
					"narration"		: JSON.parse(req.body.narration),
					"rythme"		: JSON.parse(req.body.rythme),
					"sfx"			: JSON.parse(req.body.sfx)
				};
				notes.save(function(err) {
					if (err) console.log("Erreur : " + err);
				});
			}
			else {
				var notes = new Note();

				notes.local.id_user = req.user._id;
				notes.local.id_movie = req.params.id;
				notes.local.criteres = {
					"scenario"		: JSON.parse(req.body.scenario),
					"jeu_acteurs"	: JSON.parse(req.body.jeu_acteurs),
					"realisation"	: JSON.parse(req.body.realisation),
					"bande_son"		: JSON.parse(req.body.bande_son),
					"ambiance"		: JSON.parse(req.body.ambiance),
					"lumiere"		: JSON.parse(req.body.lumiere),
					"montage"		: JSON.parse(req.body.montage),
					"dialogues"		: JSON.parse(req.body.dialogues),
					"decors"		: JSON.parse(req.body.decors),
					"costumes"		: JSON.parse(req.body.costumes),
					"narration"		: JSON.parse(req.body.narration),
					"rythme"		: JSON.parse(req.body.rythme),
					"sfx"			: JSON.parse(req.body.sfx)
				};
				notes.save(function(err) {
					if (err) console.log("Erreur : " + err);
				});
			}
		});
		res.redirect("/movie/" + req.params.id);
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
