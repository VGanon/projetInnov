import * as user from "./User";
import * as algo from "./AlgorithmRG";
import * as movies from "./Movies";

let bdd = [];

let p1 = new user.User("PH");
let p2 = new user.User("Benjamin");
let p3 = new user.User("Alexandre");
let p4 = new user.User("Bastien");

let m1 = new movies.Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
let m2 = new movies.Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
let m3 = new movies.Movie("Harry Potter episode 100", [], ["c1", "c2", "c3", "c4", "c5"]);
let m4 = new movies.Movie("American Pron", [], ["c1", "c2", "c3", "c4", "c5"]);

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

let recommendationForP1 = algo.launchAlgorithmRG(p1, bdd);
console.log("recommendationForP1");
console.log(recommendationForP1);

let recommendationForP3 = algo.launchAlgorithmRG(p3, bdd);
console.log("recommendationForP3");
console.log(recommendationForP3);
