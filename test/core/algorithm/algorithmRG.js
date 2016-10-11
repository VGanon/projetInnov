// Simplified Movie definition
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
// Simplified Watcher definition
var Watcher = (function () {
    function Watcher(u) {
        this.username = u;
    }
    return Watcher;
}());
// C'est notre PH :PH:
var ph = new Watcher("PH");
// RatedMovie definition
var RatedMovie = (function () {
    function RatedMovie(w, m, s) {
        this.user = w;
        this.movie = m;
        this.score = s;
    }
    return RatedMovie;
}());
// Test
var ingloriousBasterdsRated = new RatedMovie(ph, ingloriousBasterds, [true, false, true, false, true]);
// Un film est représenté par son contenu (Content.js)
// Utilisateur U1 note un ensemble de films. 
// Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). 
// Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1.
function rateMovie(w, m, movieScore) {
    return new RatedMovie(w, m, movieScore);
}
