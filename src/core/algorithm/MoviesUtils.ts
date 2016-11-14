import { User } from "./User";
import { Movie } from "./Movies";
import { RatedMovie } from "./Movies";

function createRatedMovieFromMovie(rater: User, movie: Movie, score: number[]): RatedMovie {
  return new RatedMovie(movie.title, movie.genres, movie.criteria, rater, score);
}
