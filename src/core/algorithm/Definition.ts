// class User
export class User {
  name: string;
  constructor(u: string) {
    this.name = u;
  }
}

// class Movie
export class Movie {
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
export class RatedMovie extends Movie {
  rater: User;
  score: number[];
  constructor(title: string, genres: string[], criteria: string[], rater: User, score: number[]) {
    super(title, genres, criteria);
    this.rater = rater;
    this.score = score;
  }
  
  // Calculer la somme des critères
  sumCriteria(): number {
    let sum = 0;
    for(let i=0; i<this.score.length; i++) {
      if(this.score[i] === 1) {
        sum++;
      }
    }
    return sum;
  }
}