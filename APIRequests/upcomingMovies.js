$("h1").append(
   "Coucou"
 );
 console.log("coucou");

/* Ceci est un exemple de traitement des données JSON récupérées via les requêtes à l'API. (ici les films qui sortent bientôt en salle)*/
  var films = getUpcomingMovies();
  console.log(films);
  var genres = getGenres();
  var genreMap = new Object();
  $.each(genres.genres, function (i, result) {
    genreMap[result.id] = result.name;
  });
  $.each(films.results, function (i, result) {
    movieGenres="";
    for(var i = 0; i < result.genre_ids.length; i++) {
      movieGenres = movieGenres + genreMap[result.genre_ids[i]];
      if(i!==(result.genre_ids.length-1)){
        movieGenres = movieGenres + ", ";
      }
    }

    var date = new Date(result.release_date);
    var dateString = ("0" + date.getUTCDate()).slice(-2) + "/" + ("0" + (date.getUTCMonth()+1)).slice(-2) +"/"+ date.getUTCFullYear();
    $("#movies").append(
      "<div id='movie'>" +
        "<span id='poster'>" +
            "<img id='poster' src='https://image.tmdb.org/t/p/w300_and_h450_bestv2" + result.poster_path + "'/>"+
        "</span>" +
        "<div id='infos'>" +
          "<p id='text'>"+
            "<a id='title' href='movie.php?id="+ result.id + "'>" + result.title + "</a>" +
            "<span id='releaseDate'>  (" +  dateString + ")</span><br/>" +
            "<span id='vote'>Note des utilisateurs TMDb : " +  result.vote_average + "/10</span><br/>" +
            "<span id='genres'>" +  movieGenres + "</span><br/>" +
          "</p>" +
          "<span id='overview'>" + result.overview + "</span>" +
        "</div>" +
      "</div>"
    );
  });
