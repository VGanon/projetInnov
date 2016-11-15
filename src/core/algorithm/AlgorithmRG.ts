import { User } from "./User";
import { Movie } from "./Movies";
import { RatedMovie } from "./Movies";
import * as importMoviesUtils from "./MoviesUtils";
var moviesUtils: any = importMoviesUtils;

// 2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire :
// - pour chaque film, on calcule la somme des critères.
// - L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement.

// Retourner les films notés par user dans la base des films notés
function watchedMoviesOfUser(user: User, bdd: RatedMovie[]): RatedMovie[] {
  let result = [];
  for(let i=0; i<bdd.length; i++) {
    if(user.name == bdd[i].rater.name) { //Egalité simple car potentiellement => Objets différents
      result.push(bdd[i]);
    }
  }
  return result;
}

// choisit le film que l'utilisteur a le plus aimé
// Retourner le film qui a la somme des criteria la plus grande dans une collection des films notés
function maxCriteriaMovie(bdd: RatedMovie[]): RatedMovie {
  if (bdd.length > 0) {

  let max = bdd[0];
  for(let i=1; i<bdd.length; i++) {
    if(max.sumCriteria() < bdd[i].sumCriteria()) {
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
function ratedMoviesByScoreDescOfUser(chosenUser: User, bdd: RatedMovie[]): RatedMovie[] {
  let result = [];
  let ratedMovies = watchedMoviesOfUser(chosenUser, bdd);
  for(let i = 0; i < ratedMovies.length; i++) {
    let max = maxCriteriaMovie(ratedMovies);
    result.unshift(max);
    ratedMovies.splice(ratedMovies.indexOf(max), 1);
  }
  return result;
}

// export function allInstancesOfThisRatedMovie(movie: Movie, bdd: RatedMovie[], excludeUser: User): RatedMovie[] {
function allInstancesOfThisRatedMovie(movie: RatedMovie, bdd: RatedMovie[], excludeUser: User): RatedMovie[] {
  let result = [];
  for(let i=0; i<bdd.length; i++) {
    if(movie.title === bdd[i].title && bdd[i].rater.name !== excludeUser.name) {
      result.push(bdd[i]);
    }
  }
  return result;
}

// NON XOR: retourner 1 si identique, 0 sinon
// En gros, 1-1 ou 0-0 retourne 1, sinon retourne 0
function nonXOR(a: number, b: number): number {
  return a === b ? 1 : 0;
}

// Calcule la somme d'un NON XOR entre la note du film de deux utilisateurs
function sumNonXOR(movie1: RatedMovie, movie2: RatedMovie): number {
  let score1 = movie1.score;
  let score2 = movie2.score;
  let sum = 0;
  for(let i=0; i<score1.length; i++) {
    sum += (nonXOR(score1[i], score2[i]));
  }
  return sum;
}

// Mettre tous les sumNonXOR dans un tableau
// movies: le même film noté par Benjamin, Thain, Bastien, etc
function nonXORTable(u1Movie: RatedMovie, movies: RatedMovie[]): any {
  let result = [];
  for(let i=0; i<movies.length; i++) {
    let compatibleScore = sumNonXOR(u1Movie, movies[i]);
    let tuple = {
      "score": compatibleScore,
      "rater": movies[i].rater
    }
    //console.log("tuple: " + tuple.score + " " + tuple.rater);
    result.push(tuple);
    //console.log("table length: " + result.length);
  }
  return result;
}

// Retouner le tuple qui a le score le plus grand dans un tableau
function maxTuple(table: any): any {
  let max = table[0];
  for(let i=1; i<table.length; i++) {
    if(max.score > table[i].score) {
      max = table[i];
    }
  }
  return max;
}

// Retourner une table en sortie qui est en ordre descendant de score par tuple,
// en utilisant les données de la table d'entrée
function filterDesc(array: any): any {
  let result = [];
  let len = array.length;
  for(let i=0; i<len; i++) {
    let max = maxTuple(array);
    result.unshift(max);
    array.splice(array.indexOf(max), 1);
  }
  return result;
}

// On prend les 10 premiers résultats du tableau
function first10(array: any): any {
  if(array.length <= 10) {
    return array;
  } else {
    let result = [];
    for(let i=0; i<10; i++) {
      result.push(array[i]);
    }
    return result;
  }
}

// 7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.
//     -> Si on obtient a en-dessous de 8 films, on recommence avec le deuxième meilleur film que U1 a aimé.
// -> Si au bout de 3 itérations ce n'est pas satisfaisant, alors on passe à l'algo de substitution
function recommendationsForU1(compatibleUsers: any, bddOfRatedMovies: RatedMovie[], u1: User): any {
  let result = [];
  let ratedMoviesByScoreDescOfU1 = ratedMoviesByScoreDescOfUser(u1, bddOfRatedMovies);
  let moviesWatchedByU1 = watchedMoviesOfUser(u1, bddOfRatedMovies);
  for(let i=0; i<compatibleUsers.length; i++) {
    let recommendationsDescUser = ratedMoviesByScoreDescOfUser(compatibleUsers[i], bddOfRatedMovies);
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
export function addNewRatedMovie(bdd: RatedMovie[], rater: User, movie: Movie, score: number[]): void {
  bdd.push(new RatedMovie(movie.title, movie.genres, movie.criteria, rater, score));
  console.log("addNewRatedMovie: Un nouveau film est noté & ajouté dans la base des films");
}

export function launchAlgorithmRG(userOne: User, ratedMovieDatabase: RatedMovie[]): any {
  // Point 2
  let allRatedMoviesByScoreDescOfU1 =
    ratedMoviesByScoreDescOfUser(userOne, watchedMoviesOfUser(userOne, ratedMovieDatabase));
  let bestMovieByU1 = allRatedMoviesByScoreDescOfU1[0];
  // Point 3
  let identicalMovieRatedByOthers =
    allInstancesOfThisRatedMovie(bestMovieByU1, ratedMovieDatabase, userOne);
  // Point 4
  let table = nonXORTable(bestMovieByU1, identicalMovieRatedByOthers);
  // Point 5
  table = filterDesc(table);
  // Point 6
  table = first10(table);
  // Point 7
  let result = [];
  // Scanning through each user who shares the similar opinion
  for(let i=0; i<table.length; i++) {
    let allRatedMoviesByScoreDescOfCurrentUser = ratedMoviesByScoreDescOfUser(table[i]["rater"], ratedMovieDatabase);
    /*console.log("allRatedMoviesByScoreDescOfCurrentUser");
    console.log(allRatedMoviesByScoreDescOfCurrentUser);*/
    // Scanning through each movie of this user
    for(let j=0; j<allRatedMoviesByScoreDescOfCurrentUser.length; j++) {
      /*console.log("210. allRatedMoviesByScoreDescOfCurrentUser[j] is ");
      console.log(allRatedMoviesByScoreDescOfCurrentUser[j]);*/
      let suspectedTitle = allRatedMoviesByScoreDescOfCurrentUser[j].title;
      // Detect whether u1 has watched the movie at (j)
      let isMovieWatched = false;
      for(let k=0; k<allRatedMoviesByScoreDescOfU1.length; k++) {
        if(allRatedMoviesByScoreDescOfU1[k].title === suspectedTitle) {
          isMovieWatched = true;
          break;
        }
      }
      if(!isMovieWatched) {
        result.push(allRatedMoviesByScoreDescOfCurrentUser[j]);
        // Found the film of this current user to recommend to u1, now search movie from the next user
        j = allRatedMoviesByScoreDescOfCurrentUser.length + 100;
      }
    }
  }
  return result;
}

export function launchLocalTest() {
  // Some samples to test
  /*console.log("Les utilisateurs:");*/
  let ph = new User("PH");
  let kribouille = new User("Benjamin");
  let thain = new User("Alexandre");
  let bastien = new User("Bastien");
  /*console.log(ph);
  console.log(kribouille);
  console.log(thain);
  console.log(bastien);
  console.log("Les films:");*/
  let ingloriousBasterds = new Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
  let djangoUnchained = new Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
  /*console.log(ingloriousBasterds);
  console.log(djangoUnchained);
  console.log("Les utilisateurs notent quelques films:");*/
  let ph_ib = moviesUtils.createRatedMovieFromMovie(ph, ingloriousBasterds, [1, 0, 1, 0, 1]);
  let ph_du = moviesUtils.createRatedMovieFromMovie(ph, djangoUnchained, [1, 0, 0, 0, 0]);
  let ben_ib = moviesUtils.createRatedMovieFromMovie(kribouille, ingloriousBasterds, [0, 0, 1, 1, 1]);
  let thain_ib = moviesUtils.createRatedMovieFromMovie(thain, ingloriousBasterds, [1, 1, 1, 0, 1]);
  let bast_ib = moviesUtils.createRatedMovieFromMovie(bastien, ingloriousBasterds, [1, 0, 1, 0, 1]);
  /*console.log(ph_ib);
  console.log(ph_du);
  console.log(ben_ib);
  console.log(thain_ib);
  console.log(bast_ib);*/
  console.log("Notre stub de bdd:");
  let notreBdd = [ph_ib, ph_du, ben_ib, thain_ib, bast_ib];
  console.log(notreBdd);
  // let allRatingOfIngBastExceptPH = arg.allInstancesOfThisRatedMovie(ingloriousBasterds, notreBdd, ph);
  let allRatingOfIngBastExceptPH = allInstancesOfThisRatedMovie(ph_ib, notreBdd, ph);
  console.log("Les utilisateurs ayant vu inglorious basterds sauf PH ont raté ce film comme ci-dessous: ");
  console.log(allRatingOfIngBastExceptPH);
  console.log("ça passe !");
  let nonXORtableDePH = nonXORTable(ph_ib, allRatingOfIngBastExceptPH);
  nonXORtableDePH = filterDesc(nonXORtableDePH);
  let firstTen = first10(nonXORtableDePH);
  console.log("First ten: ");
  console.log(firstTen);
  let allRecommendationsForPH = recommendationsForU1(firstTen, notreBdd, ph);
  console.log("Les recommendations pour PH: ");
  console.log(allRecommendationsForPH);
  console.log("ça passe !");
}
