angular.module('movieRecommendationApp', []).controller('Controller', function() {
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

	/* TMP : en attendant l'algo de recommandation */
	this.generateMovieDescription = function(title, poster_path, release_date, genre_ids, overview){
		return {
			"title": title,
			"poster_path": poster_path,
			"release_date": release_date,
			"genre_ids": genre_ids,
			"overview": overview,
		};
	};

	/* @param genreIds Tableau d'id de genres d'un film
	* @return String contenant les noms des genres correspondant aux ids des films en parametres, separes par des virgules */
	this.getMovieGenres = function(genreIds){
		return genreIds.map(id => this.movieGenres[id]).join(", ");
	};

	/* @param date String de date au format '2016-05-24'
	* @return String de date au format '24/05/2016' */
	this.adjustDate = function(date){
		return new Date(date).toLocaleString().split(" ")[0];
	};

	/* @param overview String de resume d'un film
	* @return String de resume d'un film tronquee si necessaire (max 200 caracteres) */
	this.adjustOverview = function(overview){
		return (overview.length > 200) ? overview.slice(0, 200) + "..." : overview;
	};

	/* Fonction GENERALE d'update des donnees, utilisee par les autres fonctions d'update */
	this.updateData = function(pageTitle, movies, actors, friends, enableRanking){
		this.pageTitle = pageTitle;
		this.movies = movies;
		this.actors = actors;
		this.friends = friends;
		this.enableRanking = enableRanking;
		this.nbMoviesShown = 9;
	};

	
	/* Update des donnees pour afficher les resultats de recherche */
	this.search = function(text){
		this.updateData(
			"Résultat de la recherche", 
			JSON.parse(getMovieByTitle(text)).results, 
			JSON.parse(getPeople(text)).results/*,
			JSON.parse(getFriends(text))*/
		);
	};

	/* Update des donnees pour afficher les films avec un acteur en particulier */
	this.searchByActor = function(actor, movies){
		this.updateData(
			"Films populaires avec " + actor, 
			movies
		);
	};

	/* Update des donnees pour afficher les films populaires */
	this.showPopularMovies = function(){
		this.updateData(
			"Films populaires", 
			JSON.parse(getPopularMovies()).results
		);
	};

	this.showUpcomingMovies = function() {
		this.updateData(
			"Films bientôt à l'affiche",
			JSON.parse(getUpcomingMovies()).results
		)
	}

	//Page d'accueil : films populaires
	this.showPopularMovies();
});