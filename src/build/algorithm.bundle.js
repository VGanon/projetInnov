/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var user = __webpack_require__(1);
	var algo = __webpack_require__(2);
	var movies = __webpack_require__(3);
	var bdd = [];
	var p1 = new user.User("PH");
	var p2 = new user.User("Benjamin");
	var p3 = new user.User("Alexandre");
	var p4 = new user.User("Bastien");
	var m1 = new movies.Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
	var m2 = new movies.Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
	var m3 = new movies.Movie("Harry Potter episode 100", [], ["c1", "c2", "c3", "c4", "c5"]);
	var m4 = new movies.Movie("American Pron", [], ["c1", "c2", "c3", "c4", "c5"]);
	algo.addNewRatedMovie(bdd, p1, m1, [0, 1, 0, 1, 0]);
	algo.addNewRatedMovie(bdd, p2, m1, [1, 0, 0, 0, 1]);
	algo.addNewRatedMovie(bdd, p3, m1, [0, 1, 1, 0, 0]);
	algo.addNewRatedMovie(bdd, p4, m1, [1, 0, 0, 0, 1]);
	algo.addNewRatedMovie(bdd, p1, m2, [0, 1, 0, 1, 1]);
	algo.addNewRatedMovie(bdd, p2, m2, [1, 0, 1, 0, 1]);
	algo.addNewRatedMovie(bdd, p3, m2, [0, 1, 0, 1, 0]);
	algo.addNewRatedMovie(bdd, p4, m2, [1, 0, 0, 1, 1]);
	algo.addNewRatedMovie(bdd, p4, m3, [1, 0, 0, 1, 1]); // seul p4 a regardé Harry Potter episode 100
	algo.addNewRatedMovie(bdd, p3, m4, [1, 0, 0, 1, 1]); // seul p3 a regardé ce film m4
	var recommendationForP1 = algo.launchAlgorithmRG(p1, bdd);
	console.log("recommendationForP1");
	console.log(recommendationForP1);
	var recommendationForP3 = algo.launchAlgorithmRG(p3, bdd);
	console.log("recommendationForP3");
	console.log(recommendationForP3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	// class User
	var User = (function () {
	    function User(u) {
	        this.name = u;
	    }
	    return User;
	}());
	exports.User = User;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var User_1 = __webpack_require__(1);
	var Movies_1 = __webpack_require__(3);
	var Movies_2 = __webpack_require__(3);
	var importMoviesUtils = __webpack_require__(4);
	var moviesUtils = importMoviesUtils;
	// 2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire :
	// - pour chaque film, on calcule la somme des critères.
	// - L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement.
	// Retourner les films notés par user dans la base des films notés
	function watchedMoviesOfUser(user, bdd) {
	    var result = [];
	    for (var i = 0; i < bdd.length; i++) {
	        if (user.name == bdd[i].rater.name) {
	            result.push(bdd[i]);
	        }
	    }
	    return result;
	}
	// choisit le film que l'utilisteur a le plus aimé
	// Retourner le film qui a la somme des criteria la plus grande dans une collection des films notés
	function maxCriteriaMovie(bdd) {
	    if (bdd.length > 0) {
	        var max = bdd[0];
	        for (var i = 1; i < bdd.length; i++) {
	            if (max.sumCriteria() < bdd[i].sumCriteria()) {
	                max = bdd[i];
	            }
	        }
	        return max;
	    }
	    return undefined;
	}
	/*// Retourner le "second best" film raté par l'utilisateur,
	// par rapport au meilleur film en paramètre.
	// Exemple : si le meilleur film a un score de 3/5. Alors le "2nd meilleur" aura un score MAX 3/5.
	function nextBestMovieByUser(bdd: RatedMovie[], bestMovie: RatedMovie): RatedMovie {
	  let result =
	}*/
	// Retourner une liste de films classée par l'ordre de SumCriteria descendant
	function ratedMoviesByScoreDescOfUser(chosenUser, bdd) {
	    var result = [];
	    var ratedMovies = watchedMoviesOfUser(chosenUser, bdd);
	    for (var i = 0; i < ratedMovies.length; i++) {
	        var max = maxCriteriaMovie(ratedMovies);
	        result.unshift(max);
	        ratedMovies.splice(ratedMovies.indexOf(max), 1);
	    }
	    return result;
	}
	// export function allInstancesOfThisRatedMovie(movie: Movie, bdd: RatedMovie[], excludeUser: User): RatedMovie[] {
	function allInstancesOfThisRatedMovie(movie, bdd, excludeUser) {
	    var result = [];
	    for (var i = 0; i < bdd.length; i++) {
	        if (movie.title === bdd[i].title && bdd[i].rater.name !== excludeUser.name) {
	            result.push(bdd[i]);
	        }
	    }
	    return result;
	}
	// NON XOR: retourner 1 si identique, 0 sinon
	// En gros, 1-1 ou 0-0 retourne 1, sinon retourne 0
	function nonXOR(a, b) {
	    return a === b ? 1 : 0;
	}
	// Calcule la somme d'un NON XOR entre la note du film de deux utilisateurs
	function sumNonXOR(movie1, movie2) {
	    var score1 = movie1.score;
	    var score2 = movie2.score;
	    var sum = 0;
	    for (var i = 0; i < score1.length; i++) {
	        sum += (nonXOR(score1[i], score2[i]));
	    }
	    return sum;
	}
	// Mettre tous les sumNonXOR dans un tableau
	// movies: le même film noté par Benjamin, Thain, Bastien, etc
	function nonXORTable(u1Movie, movies) {
	    var result = [];
	    for (var i = 0; i < movies.length; i++) {
	        var compatibleScore = sumNonXOR(u1Movie, movies[i]);
	        var tuple = {
	            "score": compatibleScore,
	            "rater": movies[i].rater
	        };
	        //console.log("tuple: " + tuple.score + " " + tuple.rater);
	        result.push(tuple);
	    }
	    return result;
	}
	// Retouner le tuple qui a le score le plus grand dans un tableau
	function maxTuple(table) {
	    var max = table[0];
	    for (var i = 1; i < table.length; i++) {
	        if (max.score > table[i].score) {
	            max = table[i];
	        }
	    }
	    return max;
	}
	// Retourner une table en sortie qui est en ordre descendant de score par tuple,
	// en utilisant les données de la table d'entrée
	function filterDesc(array) {
	    var result = [];
	    var len = array.length;
	    for (var i = 0; i < len; i++) {
	        var max = maxTuple(array);
	        result.unshift(max);
	        array.splice(array.indexOf(max), 1);
	    }
	    return result;
	}
	// On prend les 10 premiers résultats du tableau
	function first10(array) {
	    if (array.length <= 10) {
	        return array;
	    }
	    else {
	        var result = [];
	        for (var i = 0; i < 10; i++) {
	            result.push(array[i]);
	        }
	        return result;
	    }
	}
	// 7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.
	//     -> Si on obtient a en-dessous de 8 films, on recommence avec le deuxième meilleur film que U1 a aimé.
	// -> Si au bout de 3 itérations ce n'est pas satisfaisant, alors on passe à l'algo de substitution
	function recommendationsForU1(compatibleUsers, bddOfRatedMovies, u1) {
	    var result = [];
	    var ratedMoviesByScoreDescOfU1 = ratedMoviesByScoreDescOfUser(u1, bddOfRatedMovies);
	    var moviesWatchedByU1 = watchedMoviesOfUser(u1, bddOfRatedMovies);
	    for (var i = 0; i < compatibleUsers.length; i++) {
	        var recommendationsDescUser = ratedMoviesByScoreDescOfUser(compatibleUsers[i], bddOfRatedMovies);
	        // tricher un peu, ici on donne toujours le meilleur film de compatibleUsers[i]
	        result.push(recommendationsDescUser[0]);
	    }
	    return result;
	}
	/*
	# Algo de recommandation général

	1.  Utilisateur U1 note un ensemble de films.
	Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc).
	Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1.

	2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire :
	- pour chaque film, on calcule la somme des critères.
	- L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement.

	3.  On prend les utilisateurs qui ont noté ce même film

	4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.
	Résultat : on obtient les utilisateurs qui ont noté à l'identique ou presque le même film que U1.

	5.  On trie ce tableau des utilisateurs trouvés par ordre décroissant

	6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs

	7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.
	    -> Si on obtient a en-dessous de 8 films, on recommence avec le deuxième meilleur film que U1 a aimé.
	-> Si au bout de 3 itérations ce n'est pas satisfaisant, alors on passe à l'algo de substitution

	7.REFAIT.
	  Pour chaque user on prend leur meilleur film que U1 n'a pas vu (si U1 l'a vu, passe à leur deuxième...n-ème meilleur).
	  Si on obtient moins de 3 résultats, alors on passe à l'algo de substitution.
	*/
	// Utilisateur note un film. Une nouvelle instance du film noté est ajouté dans la base de films notés
	function addNewRatedMovie(bdd, rater, movie, score) {
	    bdd.push(new Movies_2.RatedMovie(movie.title, movie.genres, movie.criteria, rater, score));
	    console.log("addNewRatedMovie: Un nouveau film est noté & ajouté dans la base des films");
	}
	exports.addNewRatedMovie = addNewRatedMovie;
	function launchAlgorithmRG(userOne, ratedMovieDatabase) {
	    // Point 2
	    var allRatedMoviesByScoreDescOfU1 = ratedMoviesByScoreDescOfUser(userOne, watchedMoviesOfUser(userOne, ratedMovieDatabase));
	    var bestMovieByU1 = allRatedMoviesByScoreDescOfU1[0];
	    // Point 3
	    var identicalMovieRatedByOthers = allInstancesOfThisRatedMovie(bestMovieByU1, ratedMovieDatabase, userOne);
	    // Point 4
	    var table = nonXORTable(bestMovieByU1, identicalMovieRatedByOthers);
	    // Point 5
	    table = filterDesc(table);
	    // Point 6
	    table = first10(table);
	    // Point 7
	    var result = [];
	    // Scanning through each user who shares the similar opinion
	    for (var i = 0; i < table.length; i++) {
	        var allRatedMoviesByScoreDescOfCurrentUser = ratedMoviesByScoreDescOfUser(table[i]["rater"], ratedMovieDatabase);
	        /*console.log("allRatedMoviesByScoreDescOfCurrentUser");
	        console.log(allRatedMoviesByScoreDescOfCurrentUser);*/
	        // Scanning through each movie of this user
	        for (var j = 0; j < allRatedMoviesByScoreDescOfCurrentUser.length; j++) {
	            /*console.log("210. allRatedMoviesByScoreDescOfCurrentUser[j] is ");
	            console.log(allRatedMoviesByScoreDescOfCurrentUser[j]);*/
	            var suspectedTitle = allRatedMoviesByScoreDescOfCurrentUser[j].title;
	            // Detect whether u1 has watched the movie at (j)
	            var isMovieWatched = false;
	            for (var k = 0; k < allRatedMoviesByScoreDescOfU1.length; k++) {
	                if (allRatedMoviesByScoreDescOfU1[k].title === suspectedTitle) {
	                    isMovieWatched = true;
	                    break;
	                }
	            }
	            if (!isMovieWatched) {
	                result.push(allRatedMoviesByScoreDescOfCurrentUser[j]);
	                // Found the film of this current user to recommend to u1, now search movie from the next user
	                j = allRatedMoviesByScoreDescOfCurrentUser.length + 100;
	            }
	        }
	    }
	    return result;
	}
	exports.launchAlgorithmRG = launchAlgorithmRG;
	function launchLocalTest() {
	    // Some samples to test
	    /*console.log("Les utilisateurs:");*/
	    var ph = new User_1.User("PH");
	    var kribouille = new User_1.User("Benjamin");
	    var thain = new User_1.User("Alexandre");
	    var bastien = new User_1.User("Bastien");
	    /*console.log(ph);
	    console.log(kribouille);
	    console.log(thain);
	    console.log(bastien);
	    console.log("Les films:");*/
	    var ingloriousBasterds = new Movies_1.Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
	    var djangoUnchained = new Movies_1.Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
	    /*console.log(ingloriousBasterds);
	    console.log(djangoUnchained);
	    console.log("Les utilisateurs notent quelques films:");*/
	    var ph_ib = moviesUtils.createRatedMovieFromMovie(ph, ingloriousBasterds, [1, 0, 1, 0, 1]);
	    var ph_du = moviesUtils.createRatedMovieFromMovie(ph, djangoUnchained, [1, 0, 0, 0, 0]);
	    var ben_ib = moviesUtils.createRatedMovieFromMovie(kribouille, ingloriousBasterds, [0, 0, 1, 1, 1]);
	    var thain_ib = moviesUtils.createRatedMovieFromMovie(thain, ingloriousBasterds, [1, 1, 1, 0, 1]);
	    var bast_ib = moviesUtils.createRatedMovieFromMovie(bastien, ingloriousBasterds, [1, 0, 1, 0, 1]);
	    /*console.log(ph_ib);
	    console.log(ph_du);
	    console.log(ben_ib);
	    console.log(thain_ib);
	    console.log(bast_ib);*/
	    console.log("Notre stub de bdd:");
	    var notreBdd = [ph_ib, ph_du, ben_ib, thain_ib, bast_ib];
	    console.log(notreBdd);
	    // let allRatingOfIngBastExceptPH = arg.allInstancesOfThisRatedMovie(ingloriousBasterds, notreBdd, ph);
	    var allRatingOfIngBastExceptPH = allInstancesOfThisRatedMovie(ph_ib, notreBdd, ph);
	    console.log("Les utilisateurs ayant vu inglorious basterds sauf PH ont raté ce film comme ci-dessous: ");
	    console.log(allRatingOfIngBastExceptPH);
	    console.log("ça passe !");
	    var nonXORtableDePH = nonXORTable(ph_ib, allRatingOfIngBastExceptPH);
	    nonXORtableDePH = filterDesc(nonXORtableDePH);
	    var firstTen = first10(nonXORtableDePH);
	    console.log("First ten: ");
	    console.log(firstTen);
	    var allRecommendationsForPH = recommendationsForU1(firstTen, notreBdd, ph);
	    console.log("Les recommendations pour PH: ");
	    console.log(allRecommendationsForPH);
	    console.log("ça passe !");
	}
	exports.launchLocalTest = launchLocalTest;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	// class Movie
	var Movie = (function () {
	    function Movie(t, g, c) {
	        this.title = t;
	        this.genres = g;
	        this.criteria = c;
	    }
	    return Movie;
	}());
	exports.Movie = Movie;
	// class RatedMovie
	var RatedMovie = (function (_super) {
	    __extends(RatedMovie, _super);
	    function RatedMovie(title, genres, criteria, rater, score) {
	        var _this = _super.call(this, title, genres, criteria) || this;
	        _this.rater = rater;
	        _this.score = score;
	        return _this;
	    }
	    // Calculer la somme des critères
	    RatedMovie.prototype.sumCriteria = function () {
	        var sum = 0;
	        for (var i = 0; i < this.score.length; i++) {
	            if (this.score[i] === 1) {
	                sum++;
	            }
	        }
	        return sum;
	    };
	    return RatedMovie;
	}(Movie));
	exports.RatedMovie = RatedMovie;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Movies_1 = __webpack_require__(3);
	function createRatedMovieFromMovie(rater, movie, score) {
	    return new Movies_1.RatedMovie(movie.title, movie.genres, movie.criteria, rater, score);
	}


/***/ }
/******/ ]);