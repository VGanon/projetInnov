angular.module('ratedMovies', []).controller('Controller', function() {

	/* Donnees dynamiques de l'application (les update impliquera un update du html) */
	this.pageTitle = "";
	this.movies = [];
	this.actors = [];
	this.friends = [];
	this.nbMoviesShown = 9;
	this.enableRanking = false;
	/* Map id/name des genres de films (voir fonction getMovieGenres) */
	this.movieGenres = {};
	JSON.parse(getGenres()).genres.forEach( ({id, name}) => this.movieGenres[id] = name );


	this.updateData = function(movies){
		this.movies = movies;
		this.nbMoviesShown = 10;
	};
	

	/* Update des donnees pour afficher les films notés par l'utilisateur */
	this.showRatedMovies = function(){

		var ratedMovies = {
		    results: []
		};

		document.getElementById("movies");
		
		// Recuperer les films de la bdd notes where id_user = connected user (format json)
		var movies = JSON.parse($("#movies").html());

		for(var i in movies)
		{
			var movie = getMovieById(movies[i].id_movie);
			ratedMovies.results.push(JSON.parse(movie));
		}

	    this.updateData(
			ratedMovies.results
		);
		
	};


	// films notés du user
	this.showRatedMovies();
});