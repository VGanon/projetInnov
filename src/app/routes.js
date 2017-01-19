// load up the user model
var User = require('./models/user');
var Note = require('./models/note');
var Friend = require('./models/friend');

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
module.exports = function (app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function (req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {

    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/home', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));


  // =====================================
  // HOME SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/home', isLoggedIn, function (req, res) {
    Note.find(null).sort([['local.id_user', 'ascending']]).exec(function (err, notes) {
      var notes = JSON.stringify(notes);
      Note.find({ 'local.id_user': req.user._id }).exec(function (err, note) {
        var ratedMovies = JSON.stringify(note);
        var friendsIDs = [];
        Friend.findOne({ 'local.id_user': req.user._id}, function(err, friend){
          if(friend && friend.local.friends){
            for(var i = 0; i < friend.local.friends.length; i++){
              friendsIDs.push(friend.local.friends[i]._id);
            }
          }
          res.render('home.ejs', {
            ratedMovies: ratedMovies,
            notes: notes,
            friendsIDs: JSON.stringify(friendsIDs)  ,
            userId: req.user._id,
            user: req.user // get the user out of session and pass to template
          });
        });
        
      });
    });
  });

  //@return Array of users whose names are matching with the parameter
  app.get('/getUsersByName', function (req, res) {
    User.find({ 'local.username': new RegExp(req.query.username, 'i') }, function (err, users) {
      //if(err) return handleError(err);
      res.send(users);
    });
  });


  // =====================================
  // PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  // UPDATE : user = the one connected, profile = the one we show
  app.get('/profile/(:userId)?', isLoggedIn, function (req, res) {
    var userId = (req.params.userId) ? req.params.userId : req.user._id;
    Note.find({ 'local.id_user': userId }).lean().exec(function (err, note) {
      if (err) return done(err);
      var movies = JSON.stringify(note);

      //Get the profile to show
      if (req.params.userId) {
        var isAFriend = false;
        Friend.findOne({ 'local.id_user': req.user._id }).lean().exec(function (err, friend) {
          if (friend) {
            for(var i = 0; i< friend.local.friends.length; i++){
              if(friend.local.friends[i]._id == req.params.userId){
                isAFriend = true;
              }
            } 
          }
        });
        var friends = "";
        Friend.findOne({ 'local.id_user': req.params.userId }, function (err, friend) {
          if (friend) {
            friends = friend;
          }
          else{
            friends = {};
          }
        });
        User.findById(req.params.userId, function (error, profile) {
          res.render('profile.ejs', {
            user: req.user, // get the user out of session and pass to template
            profile: profile,
            friends: JSON.stringify(friends),
            isAFriend: isAFriend,
            movies: movies,
            message: ""
          });
        });
      } else {
        Friend.findOne({ 'local.id_user': req.user._id }, function (err, friend) {
          res.render('profile.ejs', {
            user: req.user, // get the user out of session and pass to template
            friends: JSON.stringify(friend),
            profile: req.user,
            movies: movies,
            message: ""
          });
        });
      }
    });
  });

  app.post('/profile/(:userId)?', isLoggedIn, function (req, res) {
    var friendToAdd = null;
    User.findById(req.params.userId, function (error, user) {
      if(user){
        friendToAdd = user;
      }
      else{
        res.redirect("/home");
      }
    });
    Friend.findOne({ 'local.id_user': req.user._id }, function (err, friend) {
      if (friend) {
        var isAFriend = false;
        for(var i = 0; i < friend.local.friends.length; i++){
          if(friend.local.friends[i]._id == req.params.userId){
            isAFriend = true;
            friend.local.friends.splice(i, 1);
            Friend.remove({ 'local.id_user': req.user._id });
            break;
          }
        }
        if(!isAFriend){
          friend.local.friends.push(friendToAdd);
        }
        friend.save(function (err) {
          if (err) console.log("Erreur : " + err);
        });
      }
      else {
        var newFriend = new Friend();
        newFriend.local.id_user = req.user._id;
        var friends = [];
        friends.push(friendToAdd);
        newFriend.local.friends = friends;
        newFriend.save(function (err) {
          if (err) console.log("Erreur : " + err);
        });
      }
    });
    res.redirect("/profile/" + req.params.userId);
  });



  // =====================================
  // CONFIGURE PROFILE SECTION =========================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/configure', isLoggedIn, function (req, res) {
    res.render('configure.ejs', {
      user: req.user, // get the user out of session and pass to template
      message: null
    });
  });

  //User update
  app.post('/configure', isLoggedIn, function (req, res) {
    //Errors
    if (!req.body.username || !req.body.email) {
      message = 'Veuillez remplir les champs obligatoires !';
      res.render('configure.ejs', {
        user: req.user, // get the user out of session and pass to template
        message: 'Veuillez remplir les champs obligatoires !'
      });
    } else if (req.body.newPassword !== req.body.confirmNewPassword) {
      res.render('configure.ejs', {
        user: req.user, // get the user out of session and pass to template
        message: 'La confirmation du nouveau mot de passe est incorrecte !'
      });
    }

    else {

      User.findOne({ '_id': req.user._id }, function (err, user) {
        // password = newPassword only if newPassword not empty
        var pass = user.generateHash(req.body.newPassword);
        if (err) return done(err);

        if (!req.body.newPassword && !req.body.confirmNewPassword) {
          pass = user.local.password;
        }



        User.findOne({ 'local.username': req.body.username }, function (err, username) {
          //  if new username exists already (but not current user)
          if (username && (req.body.username !== req.user.local.username)) {
            res.render('configure.ejs', {
              user: req.user,
              message: 'Le nom d\'utilisateur est déjà utilisé !'
            });

          } else if (req.body.username.length > 10) {
            // if username invalid
            res.render('configure.ejs', {
              user: req.user,
              message: 'Le nom d\'utilisateur ne doit pas dépasser 10 caractères !'
            });


          } else if (!validateEmail(req.body.email)) {
            // if email format is invalid
            res.render('configure.ejs', {
              user: req.user,
              message: 'L\' adresse email est invalide !'
            });

          } else if (req.body.newPassword && !validatePassword(req.body.newPassword)) {
            // if password is invalid
            res.render('configure.ejs', {
              user: req.user,
              message: 'Le mot de passe doit contenir au moins 8 caractères, au moins une lettre majuscule, une lettre miniscule et un chiffre !'
            });

          } else {

            User.findOne({ 'local.email': req.body.email }, function (err, email) {
              // if email exists
              if (email && (req.body.email !== req.user.local.email)) {
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
                user.save(function () {
                  //Relog mandatory to reload from base
                  req.login(user, function (err) {
                    if (err) return next(err);

                    Note.find({ 'id_user': req.user._id }).lean().exec(function (err, note) {
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
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });


  // =====================================
  // MOVIE ===============================
  // =====================================
  app.get('/movie/:id', isLoggedInToLogin, function (req, res) {
    if (isNaN(parseInt(req.params.id, 10)) || parseInt(req.params.id, 10) < 0) res.redirect('/home');
    else {
      Note.findOne({ 'local.id_user': req.user._id, 'local.id_movie': req.params.id }, function (err, notes) {
        if (notes) {
          res.render('movie.ejs', {
            user: req.user, // get the user out of session and pass to template
            id: req.params.id,
            criteres: JSON.stringify(notes.local.criteres)
          });
        }
        else {
          res.render('movie.ejs', {
            user: req.user, // get the user out of session and pass to template
            id: req.params.id,
            criteres: "null"
          });
        }
      });
    }
  });

  app.post('/movie/:id', isLoggedInToLogin, function (req, res) {

    Note.findOne({ 'local.id_user': req.user._id, 'local.id_movie': req.params.id }, function (err, notes) {
      var criteres = {
        "scenario": JSON.parse(req.body.scenario),
        "jeu_acteurs": JSON.parse(req.body.jeu_acteurs),
        "realisation": JSON.parse(req.body.realisation),
        "bande_son": JSON.parse(req.body.bande_son),
        "ambiance": JSON.parse(req.body.ambiance),
        "lumiere": JSON.parse(req.body.lumiere),
        "montage": JSON.parse(req.body.montage),
        "dialogues": JSON.parse(req.body.dialogues),
        "decors": JSON.parse(req.body.decors),
        "costumes": JSON.parse(req.body.costumes),
        "narration": JSON.parse(req.body.narration),
        "rythme": JSON.parse(req.body.rythme),
        "sfx": JSON.parse(req.body.sfx)
      };

      // Vérification des critères null ou non
      var criteresVide = true;
      for (i in criteres) {
        if (criteres[i] === true || criteres[i] === false) {
          criteresVide = false;
          break;
        }
      }

      if (notes && criteresVide === false)	// Si il y a déjà une note en base et que au moins un des critères est non null alors on met à jour
      {
        notes.local.criteres = criteres;
        notes.save(function (err) {
          if (err) console.log("Erreur : " + err);
        });
      }
      else if (notes && criteresVide === true)	// Sinon si il y a déjà une note en base et que tous les nouveaux critères sont null alors on supprime la note
      {
        notes.remove(function (err) {
          if (err) console.log("Erreur : " + err);
        });
      }
      else if (criteresVide === false)	// Si il n'y a pas de note en base et que au moins un des nouveaux critères est non null alors on ajoute la note
      {
        var notes = new Note();

        notes.local.id_user = req.user._id;
        notes.local.id_movie = req.params.id;
        notes.local.criteres = notes.local.criteres = criteres;

        notes.save(function (err) {
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
