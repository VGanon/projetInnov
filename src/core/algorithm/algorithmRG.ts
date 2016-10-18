// class User
class User {
  name: string;
  constructor(u: string) {
    this.name = u;
  }
}

// class Movie
class Movie {
  title: string;
  genres: string[];
  criteria: string[];
  constructor(t: string, g: string[], c: string[]) {
    this.title = t;
    this.genres = g;
    this.criteria = c;
  }
}

// class RatedMovie
class RatedMovie extends Movie {
  rater: User;
  score: number[];
  constructor(title: string, genres: string[], criteria: string[], rater: User, score: number[]) {
    super(title, genres, criteria);
    this.rater = rater;
    this.score = score;
  }
  
  // Calculer la somme des critères
  makeSumCriteria(): number {
    let sum = 0;
    for(let i=0; i<this.score.length; i++) {
      if(this.score[i] === 1) {
        sum++;
      }
    }
    return sum;
  }
}

// Utilisateur U1 note un ensemble de films. 
// Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). 
// Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1.
function rateMovie(rater: User, movie: Movie, score: number[]): RatedMovie {
  return new RatedMovie(movie.title, movie.genres, movie.criteria, rater, score);
}

// 2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire : 
// - pour chaque film, on calcule la somme des critères.
// - L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement. 
function recommendedMovie(movies: RatedMovie[]): RatedMovie {
  let max = movies[0];
  for(let i=1; i<movies.length; i++) {
    if(movies[i].makeSumCriteria() > max.makeSumCriteria()) {
      max = movies[i];
    }
  }
  return max;
}

function recommendedMovieByCriteriaSum(movies: RatedMovie[], sumCriteria: number) {
  let max = movies[0];
  for(let i=1; i<movies.length; i++) {
    if( (movies[i].makeSumCriteria() > max.makeSumCriteria()) &&
      (movies[i].makeSumCriteria() < sumCriteria) ) {
      max = movies[i];
    }
  }
  return max;
}

// 3.  On prend les utilisateurs qui ont noté ce même film
// 2 accesseurs: 
function allUsersWhoRatedThisMovie(movie: Movie, bdd: RatedMovie[]) {
  let result = [];
  for(let i=0; i<bdd.length; i++) {
    if(movie.title === bdd[i].title) {
      result.push(bdd[i]);
    }
  }
}

function allRatedMoviesFromAnUser(user: User, bdd: RatedMovie[]): RatedMovie[] {
  let result = [];
  for(let i=0; i<bdd.length; i++) {
    if(user === bdd[i].rater) {
      result.push(bdd[i]);
    }
  }
  return result;
}

// 4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.
// Résultat : on obtient les utilisateurs qui ont noté à l'identique ou presque le même film que U1.
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
// movies: les meilleurs recommendations de Benjamin, Thain, Bastien, etc
function sumNonXORuserArray(u1Movie: RatedMovie, movies: RatedMovie[]): any {
  let tuple: [number, User]; // compatible (NXOR) score, User
  let result = [];
  for(let i=0; i<movies.length; i++) {
    let compatibleScore = sumNonXOR(u1Movie, movies[i]);
    tuple = [compatibleScore, movies[i].rater];
    console.log("tuple: " + tuple);
    result.push(tuple);
    console.log("table length: " + result.length);
  }
  return result;
}

function sumNonXORuserObject(u1Movie: RatedMovie, movies: RatedMovie[]): any {
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

// 5.  On trie ce tableau des utilisateurs trouvés par ordre décroissant  
function maxTuple(table: any) {
  let max = table[0];
  for(let i=1; i<table.length; i++) {
    if(max.score > table[i].score) {
      max = table[i];
    }
  }
  return max;
}

function filterDescObject(array: any): any {
  let result = [];
  let len = array.length;
  for(let i=0; i<len; i++) {
    let max = maxTuple(array);
    result.unshift(max);
    array.splice(array.indexOf(max), 1);
    console.log("toto");
  }
  return result;
}

// 6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs  
function getFirstTen(array: any): any {
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
function otherRecommendations(compatibleUsers: any, bddOfRatedMovies: RatedMovie[], criteriaSum: number): any {
  let allRatedMoviesFromAnUser = function(user: User, bdd: RatedMovie[]): RatedMovie[] {
    let result = [];
    for(let i=0; i<bdd.length; i++) {
      if(user === bdd[i].rater) {
        result.push(bdd[i]);
      }
    }
    return result;
  }
  let result = [];
  for(let i=0; i<compatibleUsers.length; i++) {
    let recommendation = recommendedMovieByCriteriaSum(
      allRatedMoviesFromAnUser(compatibleUsers[i], bddOfRatedMovies),
      criteriaSum);
    result.push(recommendation);
  }
  return result;
}


// Some samples to test
console.log("Les utilisateurs:");
let ph = new User("PH");
let kribouille = new User("Benjamin");
let thain = new User("Alexandre");
let bastien = new User("Bastien");
console.log(ph);
console.log(kribouille);
console.log(thain);
console.log(bastien);
console.log("Les films:");
let ingloriousBasterds = new Movie("Inglorious Basterds", ["action", "drama"], ["c1", "c2", "c3", "c4", "c5"]);
let djangoUnchained = new Movie("Django Unchained", ["action", "comedy"], ["c1", "c2", "c3", "c4", "c5"]);
console.log(ingloriousBasterds);
console.log(djangoUnchained);
console.log("Les utilisateurs notent quelques films:");
let ph_ib = rateMovie(ph, ingloriousBasterds, [1, 0, 1, 0, 1]);
let ph_du = rateMovie(ph, djangoUnchained, [1, 0, 0, 0, 0]);
let ben_ib = rateMovie(kribouille, ingloriousBasterds, [0, 0, 1, 1, 1]);
let thain_ib = rateMovie(thain, ingloriousBasterds, [1, 1, 1, 0, 1]);
let bast_ib = rateMovie(bastien, ingloriousBasterds, [1, 0, 1, 0, 1]);
console.log(ph_ib);
console.log(ph_du);
console.log(ben_ib);
console.log(thain_ib);
console.log(bast_ib);
console.log("Notre stub de bdd:");
let notreBdd = [ph_ib, ph_du, ben_ib, thain_ib, bast_ib];
console.log(notreBdd);
console.log("Test fonction recommendedMovie():");
let best_ph = recommendedMovie([ph_ib, ph_du]);
console.log(best_ph);
let best_ben = recommendedMovie([ben_ib]);
let best_thain = recommendedMovie([thain_ib]);
let best_bast = recommendedMovie([bast_ib]);
// Ici dans le test, on suppose que les résultats tirés sur le film Inglorious Basterds sont:
let userRecommended = [best_ben, best_thain, best_bast];
//let table = sumNonXORuserArray(best_ph, userRecommended);
let table = sumNonXORuserObject(best_ph, userRecommended);
//console.log(table);
table = filterDescObject(table);
console.log(table);
let firstTen = getFirstTen(table);
let criteriaSum = 1; // supposons
let otherRecs = otherRecommendations(firstTen, notreBdd, criteriaSum);
console.log("otherRecs: " + otherRecs);