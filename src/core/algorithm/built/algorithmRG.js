var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// class User
var User = (function () {
    function User(u) {
        this.name = u;
    }
    return User;
}());
// class Movie
var Movie = (function () {
    function Movie(t, g, c) {
        this.title = t;
        this.genres = g;
        this.criteria = c;
    }
    return Movie;
}());
// class RatedMovie
var RatedMovie = (function (_super) {
    __extends(RatedMovie, _super);
    function RatedMovie(title, genres, criteria, rater, score) {
        _super.call(this, title, genres, criteria);
        this.rater = rater;
        this.score = score;
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
// Utilisateur U1 note un ensemble de films. 
// Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). 
// Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1.
function rateMovie(rater, movie, score) {
    return new RatedMovie(movie.title, movie.genres, movie.criteria, rater, score);
}
// 2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire : 
// - pour chaque film, on calcule la somme des critères.
// - L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement. 
// 3.  On prend les utilisateurs qui ont noté ce même film
// 2 accesseurs: 
function allInstancesOfThisRatedMovie(movie, bdd, excludeUser) {
    var result = [];
    for (var i = 0; i < bdd.length; i++) {
        if (movie.title === bdd[i].title && bdd[i].rater.name !== excludeUser.name) {
            result.push(bdd[i]);
        }
    }
    return result;
}
function watchedMoviesOfUser(user, bdd) {
    var result = [];
    for (var i = 0; i < bdd.length; i++) {
        if (user === bdd[i].rater) {
            result.push(bdd[i]);
        }
    }
    return result;
}
// Retourner le film qui a la somme des criteria la plus grande dans une collection des films notés 
function maxCriteriaMovie(bdd) {
    var max = bdd[0];
    for (var i = 1; i < bdd.length; i++) {
        if (max.sumCriteria() < bdd[i].sumCriteria()) {
            max = bdd[i];
        }
    }
    return max;
}
// Retourner une liste de films classée par l'ordre de SumCriteria descendant
function recommendedMoviesByUser(chosenUser, bdd) {
    var result = [];
    var ratedMovies = watchedMoviesOfUser(chosenUser, bdd);
    var len = bdd.length;
    for (var i = 0; i < len; i++) {
        var max = maxCriteriaMovie(bdd);
        result.unshift(max);
        bdd.splice(bdd.indexOf(max), 1);
    }
    return result;
}
// 4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.
// Résultat : on obtient les utilisateurs qui ont noté à l'identique ou presque le même film que U1.
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
function sumNonXORuserObject(u1Movie, movies) {
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
// 5.  On trie ce tableau des utilisateurs trouvés par ordre décroissant  
function maxTuple(table) {
    var max = table[0];
    for (var i = 1; i < table.length; i++) {
        if (max.score > table[i].score) {
            max = table[i];
        }
    }
    return max;
}
function filterDescObject(array) {
    var result = [];
    var len = array.length;
    for (var i = 0; i < len; i++) {
        var max = maxTuple(array);
        result.unshift(max);
        array.splice(array.indexOf(max), 1);
    }
    return result;
}
// 6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs  
function getFirstTen(array) {
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
function allRecommendationsForU1(compatibleUsers, bddOfRatedMovies, u1) {
    var result = [];
    var moviesWatchedByU1 = watchedMoviesOfUser(u1, bddOfRatedMovies);
    for (var i = 0; i < compatibleUsers.length; i++) {
        var recommendationsDescUser = recommendedMoviesByUser(compatibleUsers[i], bddOfRatedMovies);
        // tricher un peu, ici on donne toujours le meilleur film de compatibleUsers[i]
        result.push(recommendationsDescUser[0]);
    }
    return result;
}
// Some samples to test
console.log("Les utilisateurs:");
var ph = new User("PH");
var kribouille = new User("Benjamin");
var thain = new User("Alexandre");
var bastien = new User("Bastien");
console.log(ph);
console.log(kribouille);
console.log(thain);
console.log(bastien);
console.log("Les films:");
var ingloriousBasterds = new Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
var djangoUnchained = new Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
console.log(ingloriousBasterds);
console.log(djangoUnchained);
console.log("Les utilisateurs notent quelques films:");
var ph_ib = rateMovie(ph, ingloriousBasterds, [1, 0, 1, 0, 1]);
var ph_du = rateMovie(ph, djangoUnchained, [1, 0, 0, 0, 0]);
var ben_ib = rateMovie(kribouille, ingloriousBasterds, [0, 0, 1, 1, 1]);
var thain_ib = rateMovie(thain, ingloriousBasterds, [1, 1, 1, 0, 1]);
var bast_ib = rateMovie(bastien, ingloriousBasterds, [1, 0, 1, 0, 1]);
console.log(ph_ib);
console.log(ph_du);
console.log(ben_ib);
console.log(thain_ib);
console.log(bast_ib);
console.log("Notre stub de bdd:");
var notreBdd = [ph_ib, ph_du, ben_ib, thain_ib, bast_ib];
console.log(notreBdd);
var allRatingOfIngBastExceptPH = allInstancesOfThisRatedMovie(ingloriousBasterds, notreBdd, ph);
//console.log("Les utilisateurs ayant vu inglorious basterds sauf PH sont: " + allRatingOfIngBastExceptPH);
console.log("ça passe !");
var nonXORtableDePH = sumNonXORuserObject(ph_ib, allRatingOfIngBastExceptPH);
nonXORtableDePH = filterDescObject(nonXORtableDePH);
var firstTen = getFirstTen(nonXORtableDePH);
console.log("First ten: ");
console.log(firstTen);
var allRecommendationsForPH = allRecommendationsForU1(firstTen, notreBdd, ph);
console.log("Les recommendations pour PH: ");
console.log(allRecommendationsForPH);
/*
bordel à tester
let table = sumNonXORuserObject(best_ph, userRecommended);
//console.log(table);
table = filterDescObject(table);
console.log(table);
let firstTen = getFirstTen(table);
let criteriaSum = 1; // supposons
let otherRecs = otherRecommendations(firstTen, notreBdd, criteriaSum);
console.log("otherRecs: " + otherRecs);
*/ 
