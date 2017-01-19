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
	};
	

	/* Update des donnees pour afficher les films notés par l'utilisateur */
	this.showRatedMovies = function(){
		var ratedMovies = {
		    results: []
		};
		
		// Recuperer les films de la bdd notes where id_user = connected user (format json)
		var movies = JSON.parse($("#movies").html());
		for(var i in movies)
		{
			var movie = getMovieById(movies[i].local.id_movie);
			ratedMovies.results.push(JSON.parse(movie));
		}

		if(ratedMovies.results !== 'undefined' && ratedMovies.results.length !== 0) {
			$("#message").hide();
			this.updateData(
				ratedMovies.results
			);
		} else {
			$("#message").show();
		}
		
	};

	/* Update des donnees pour afficher les amis de l'utilisateur */
	this.showFriends = function(){
		var friends = null;
		try{
			friends = JSON.parse($("#friends").html()).local.friends;
		} catch(e){}
		if(friends && friends.length) {
			$("#message-friends").hide();
			this.friends = friends;
		} else {
			$("#message-friends").show();
		}
	};


	// films notés du user
	this.showRatedMovies();
	// amis du user
	this.showFriends();
});