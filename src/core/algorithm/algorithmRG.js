// class Movie
var Movie = (function () {
    function Movie(t, g, c) {
        this.title = t;
        this.genres = g;
        this.criteria = c;
    }
    return Movie;
}());
// Test
var ingloriousBasterds = new Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
var djangoUnchained = new Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
// class Watcher
var Watcher = (function () {
    function Watcher(u) {
        this.username = u;
    }
    return Watcher;
}());
// Test: C'est notre fameux PH :PH:
var ph = new Watcher("PH");
var kribouille = new Watcher("Benjamin");
var thain = new Watcher("Alexandre");
var bastien = new Watcher("Bastien");
// class MovieRatedByUser
var MovieRatedByUser = (function () {
    function MovieRatedByUser(w, m, s) {
        this.user = w;
        this.movie = m;
        this.score = s;
        for (var i = 0; i < s.length; i++) {
            if (s[i] > 1) {
                console.log("Error while creating movie " + m + " rated by " + w.username + ": score is neither 0 nor 1.");
            }
        }
    }
    // Pour chaque film, on calcule la somme des critères.
    MovieRatedByUser.prototype.makeSumCriteria = function () {
        var sum = 0;
        for (var i = 0; i < this.score.length; i++) {
            if (this.score[i] === 1) {
                sum++;
            }
        }
        return sum;
    };
    return MovieRatedByUser;
}());
// Utilisateur U1 note un ensemble de films. 
// Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). 
// Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1.
function rateMovie(w, m, movieScore) {
    return new MovieRatedByUser(w, m, movieScore);
}
// Test
var ph_ib = rateMovie(ph, ingloriousBasterds, [1, 0, 1, 0, 1]);
var ph_du = rateMovie(ph, djangoUnchained, [1, 0, 0, 0, 0]);
var ben_ib = rateMovie(kribouille, ingloriousBasterds, [0, 0, 1, 1, 1]);
var thain_ib = rateMovie(thain, ingloriousBasterds, [1, 1, 1, 0, 1]);
var bast_ib = rateMovie(bastien, ingloriousBasterds, [1, 0, 1, 0, 1]);
// 2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire : 
// - pour chaque film, on calcule la somme des critères.
// - L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement. 
function takeBestFilmFromUser(movies) {
    var max = movies[0];
    for (var i = 1; i < movies.length; i++) {
        if (movies[i].makeSumCriteria() > max.makeSumCriteria()) {
            max = movies[i];
        }
    }
    return max;
}
// Test
var best_ph = takeBestFilmFromUser([ph_ib, ph_du]);
var best_ben = takeBestFilmFromUser([ben_ib]);
var best_thain = takeBestFilmFromUser([thain_ib]);
var best_bast = takeBestFilmFromUser([bast_ib]);
// 3.  On prend les utilisateurs qui ont noté ce même film
// Ici dans le test, on suppose que les résultats tirés sur le film Inglorious Basterds sont les 4 best_* ci-dessus
var bestOf = [best_ben, best_thain, best_bast];
// 4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.
// Résultat : on obtient les utilisateurs qui ont noté à l'identique ou presque le même film que U1.
// NON XOR: retourner 1 si identique, 0 sinon
function calcNXOR(a, b) {
    return a === b ? 1 : 0;
}
function moviesMatchBetweenTwoUsers(movie1, movie2) {
    var score1 = movie1.score;
    var score2 = movie2.score;
    var sum = 0;
    for (var i = 0; i < score1.length; i++) {
        sum += (calcNXOR(score1[i], score2[i]));
    }
    return sum;
}
// 5.  On trie ce tableau des utilisateurs trouvés par ordre décroissant  
function trier(bests) {
    var result = [bests.length];
    var matchScoreMap = new Map();
    for (var i = 0; i < bests.length; i++) {
        matchScoreMap.set(moviesMatchBetweenTwoUsers(best_ph, bests[i]), bests[i].user);
    }
    var mapDesc = new Map(matchScoreMap.entries().slice().sort(function (a, b) { return a[0] - b[0]; }));
    return mapDesc;
}
// 6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs  
// 7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.  
//     -> Si on obtient a en-dessous de 8 films, on recommence avec le deuxième meilleur film que U1 a aimé.
// -> Si au bout de 3 itérations ce n'est pas satisfaisant, alors on passe à l'algo de substitution 
