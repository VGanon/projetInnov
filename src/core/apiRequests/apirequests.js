/*********************** Ce fichier contient les méthodes d'appel à l'API TMDB. Chaque méthode retourne du JSON.***********************/

/* Voir https://developers.themoviedb.org/3/getting-started pour le contenu de la réponse JSON */

// clé de l'API obligatoire pour effectuer des requêtes via TMDB
var api_key = "05d0945593bbe2c691c2a856beab8081";

/**
* Retourne les films qui vont bientôt sortir en salle
*/
function getUpcomingMovies(){
  var url = "https://api.themoviedb.org/3/movie/upcoming?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne les films les plus populaires
*/
function getPopularMovies(){
  var url = "https://api.themoviedb.org/3/movie/popular?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne les films correspondants au titre passé en paramètre
*/
function getMovieByTitle(title){
  title = title.replace(" ", "+");
  var url = "http://api.themoviedb.org/3/search/movie?api_key=" + api_key + "&query=" + title + "&language=fr";
  return get(url);
}

/**
* Retourne le film qui correspond à l'id passé en paramètre. Cet id peut être un entier ou une chaine de caractères.
*/
function getMovieById(id){
  var url = "http://api.themoviedb.org/3/movie/" + id + "?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne tous les genres de film existants sur TMDB.
*/
function getGenres(){
  var url = "http://api.themoviedb.org/3/genre/movie/list?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne les acteurs et l'équipe de réalisation du film passé en paramètre
*/
function getCredits(id){
  var url = "http://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne les vidéos (identifiants de vidéo Youtube) du film passé en paramètre (en général ce sont des bandes-annonces ou des teasers)
*/
function getVideos(id){
  var url = "http://api.themoviedb.org/3/movie/" + id + "/videos?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne les infos de la personne (acteur ou autre) passée en paramètre
*/
function getPersonDetails(id){
  var url = "http://api.themoviedb.org/3/person/" + id + "?api_key=" + api_key + "&language=fr";
  return get(url);
}

/**
* Retourne les personnes dont le nom match avec le paramètre
*/
function getPeople(text){
  var url = "http://api.themoviedb.org/3/search/person?api_key=" + api_key + "&query=" + text + "&language=fr"
  return get(url);
}

/**
* Retourne les images de la personne (acteur ou autre) passée en paramètre
*/
function getPersonImages(id){
  var url = "http://api.themoviedb.org/3/person/" + id + "/images?api_key=" + api_key + "&language=fr";
  return get(url);
}


// Méthode principale qui effectue la requête vers TMDB
function get(url){
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET",url,false);
  Httpreq.send(null);
  return Httpreq.responseText;
}
