"use strict";
var Definition_1 = require("./Definition");
// Utilisateur U1 note un ensemble de films. 
// Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). 
// Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1.
function rateMovie(rater, movie, score) {
    return new Definition_1.RatedMovie(movie.title, movie.genres, movie.criteria, rater, score);
}
exports.rateMovie = rateMovie;
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
exports.allInstancesOfThisRatedMovie = allInstancesOfThisRatedMovie;
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
exports.sumNonXORuserObject = sumNonXORuserObject;
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
exports.filterDescObject = filterDescObject;
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
exports.getFirstTen = getFirstTen;
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
exports.allRecommendationsForU1 = allRecommendationsForU1;
