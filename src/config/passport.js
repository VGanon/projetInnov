// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../app/models/user');

// function to check if an email is valid
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        if(req.body.email === 'undefined') {
            return done(null, false, req.flash('signupMessage', 'Veuillez saisir votre email et mot de passe !'));
        }

        // if username exists
        User.findOne({ 'local.username' :  req.body.username }, function(err, user) {
            if(user) {
                return done(null, false, req.flash('signupMessage', 'Le nom d\'utilisateur est déjà utilisé !'));
            } else if(req.body.username.length > 10) {
                return done(null, false, req.flash('signupMessage', 'Le nom d\'utilisateur ne doit pas dépasser 10 caractères !'));
            } else {
                // if email exists
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'L\' adresse email est déjà utilisée !'));
                    } else if(!validateEmail(email)) {
                        return done(null, false, req.flash('signupMessage', 'L\' adresse email est invalide !'));
                    } else if (password !== req.body.confirmpassword) {
                        // if password is not equal to confirmpassword
                        return done(null, false, req.flash('signupMessage', 'La confirmation de mot de passe est incorrecte !'));

                        // password requirements
                    } else if (password.length < 8) {
                        return done(null, false, req.flash('signupMessage', 'Le mot de passe doit contenir au moins 8 caractères !'));
                    } else if (!password.match(/[a-z]/) || !password.match(/[A-Z]/) || !password.match(/\d/)) {
                        return done(null, false, req.flash('signupMessage', 'Le mot de passe doit contenir au moins une lettre majuscule, une lettre miniscule et un chiffre !'));


                    } else {

                        // if no problems
                        // create the user
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.local.email    = email;
                        newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                        newUser.local.username = req.body.username;
                        newUser.local.categories = req.body.categories;

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            }

        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'L\'email entré ne correspond à aucun compte !')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Mot de passe incorrect !')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
