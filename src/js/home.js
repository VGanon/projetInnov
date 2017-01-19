angular.module('movieRecommendationCategorie', []).controller('Controller', function() {
	/* Donnees dynamiques de l'application (les update impliquera un update du html) */
	this.pageTitle = "";
	this.movies = [];
	this.actors = [];
	this.friends = [];
	this.pageImg = null;
	this.nbMoviesShown = 15;
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
		return genreIds ? genreIds.map(id => this.movieGenres[id]).join(", ") : "";
	};

	/* @param date String de date au format '2016-05-24'
	* @return String de date au format '24/05/2016' */
	this.adjustDate = function(date){
		return date ? new Date(date).toLocaleString().split(" ")[0] : "";
	};

	/* @param overview String de resume d'un film
	* @return String de resume d'un film tronquee si necessaire (max 200 caracteres) */
	this.adjustOverview = function(overview){
		var ret = overview ? overview : "";
		return (ret.length > 200) ? ret.slice(0, 200) + "..." : ret;
	};

	/* Fonction GENERALE d'update des donnees, utilisee par les autres fonctions d'update */
	this.updateData = function(pageTitle, movies, actors, friends, enableRanking, pageImg){
		this.pageTitle = pageTitle;
		this.movies = movies;
		this.actors = actors;
		this.friends = friends;
		this.enableRanking = enableRanking;
		this.pageImg = pageImg;
		this.nbMoviesShown = 15;
		console.log("pageTitle : ", pageTitle);
		console.log("movies : ", movies);
		console.log("actors : ", actors);
		console.log("friends : ", friends);
	};

	/* Update des donnees pour afficher les resultats de recherche */
	this.search = function(text){
		var movies = JSON.parse(getMovieByTitle(text)).results;
		var actors = JSON.parse(getPeople(text)).results;
		//Requete ajax pour recup users
		$.ajax({
			method: 'GET',
			async: false,
			url: 'getUsersByName',
			data: {'username': text},
			success: function(users){
				this.updateData(
					"Résultat de la recherche",
					movies, actors, users
				);
			}.bind(this)
		});
	};

	/* Update des donnees pour afficher les films avec un acteur en particulier */
	this.searchByActor = function(actor){
		this.updateData(
			"Films avec " + actor.name,
			JSON.parse(getMovieCredits(actor.id)).cast, null, null, null,
			actor.profile_path
		);
	};

	this.searchById = function(id){
		this.updateData(
			"Résultat de la recherche",
			JSON.parse(getMovieById(text)).results
		);
	}
	this.showRecommandedMoviesByNotes = function(users){
		if(users == "friends"){
			users = JSON.parse($("#friends").html());
		}
	    var notes = JSON.parse($("#notes").html());
	    var userID = $("#userID").html();
		if(users.length == 0){
			this.updateData(
			"Vous devez ajouter des amis pour avoir des recommandations.",
			null
			);
		}
		else{
			var finalMovies = getRecommandations(notes, userID, users);
			if(finalMovies.length == 0){
				var title = "Nous ne pouvons vous recommander de films pour l'instant. Noter des films peut résoudre ce problème ;)";
				if(users != "all"){
					title = "En nous basant sur les notes de vos amis, nous ne trouvons pas encore de films à vous recommander.";
				}
				this.updateData(title,null);
			} else {
				var resultMovies = {
						results: []
				};
				for(var i = 0; i < finalMovies.length; i++){
					var movie = JSON.parse(getMovieById(finalMovies[i]));
					resultMovies.results.push(movie);
				}
				var title = "Films recommandés par BestMoviesChoice";
				if(users != "all"){
					title = "Films recommandés selon les notes de mes amis";
				}
				this.updateData(
					title,
					resultMovies.results
				);
			}
		}
		
	}

	/* Update des donnees pour afficher les films recommandés par les catégories préférées de l'utilisateur */
	this.showRecommandedMoviesByCategories = function(){

		var user_categories = $("#user_categories").html();

		var user_categories_array = user_categories.split(",");
		for(var s = 0; s < user_categories_array.length; s++){
		    user_categories_array[s] = user_categories_array[s].toUpperCase();
		}

		var resultMovies = {
		    results: []
		};

		var popularMovies =  JSON.parse(getPopularMovies()).results;

		// si aucune catégorie préférée => afficher tous les films
		if(user_categories === 'undefined' || user_categories.length === 0) {
			resultMovies.results = popularMovies;
		} else {
			// récupérer les films notés par l'utilisateur
			var ratedMovies = JSON.parse($("#ratedMovies").html());

			// pour chaque film de popularMovies
			for(var i in popularMovies)
			{
				var alreadyRated = false;


				for(var j in ratedMovies) {
    				// si le film n'est pas noté par l'utilisateur on l'affiche

					if(popularMovies[i].id == ratedMovies[j].local.id_movie) {
						console.log("Hide -> Film deja noté : " + popularMovies[i].title);
						alreadyRated = true;
						break;
					}
				}

				if(!alreadyRated) {

					var genresMovie = popularMovies[i].genre_ids;
					// Pour chaque categorie du film
					for(var j in genresMovie)
					{
						// get genre name from genre_id
						var genre_name = this.movieGenres[genresMovie[j]];

						// si genre in user_categories
						if($.inArray(genre_name.toUpperCase(), user_categories_array) !== -1)
						{
							var movie = popularMovies[i];
							resultMovies.results.push(movie);
							break;
						}
					}
				}
			}
		}


		if(resultMovies.results !== 'undefined' && resultMovies.results.length !== 0) {
			this.updateData(
				"Films recommandés par catégories préférées",
				resultMovies.results
			);
		} else {
			this.updateData(
				"Aucun film recommandés pour vous",
				resultMovies.results
			);
		}


	};

	//Page d'accueil : films recommandés selon catégories choisies
	this.showRecommandedMoviesByCategories();
});
