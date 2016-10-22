"use strict";
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
exports.User = User;
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
exports.RatedMovie = RatedMovie;
