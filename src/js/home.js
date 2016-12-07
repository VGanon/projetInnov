angular.module('movieRecommendationCategorie', []).controller('Controller', function() {
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

	/* Update des donnees pour afficher les films recommendes
	/* CONTENU TMP : en attendant l'algo de recommandation */
/*	this.showRecommendedMovies = function(){
		// ----- TMP 
		var tmpMovies = [];
		tmpMovies.push(this.generateMovieDescription("Django Unchained", "tmp/images/django_unchained.jpg", "2015-10-12", [28, 12, 16], 
			"Dans le sud des États-Unis, deux ans avant la guerre de Sécession, le Dr King Schultz," +
			"un chasseur de primes allemand, fait l’acquisition de Django, un esclave qui peut l’aider" + 
			"à traquer les frères Brittle, les meurtriers qu’il recherche. Schultz promet à Django de lui" +
			"rendre sa liberté lorsqu’il aura capturé les Brittle – morts ou vifs." +
			"Alors que les deux hommes pistent les dangereux criminels, Django n’oublie pas que son seul" +
			"but est de retrouver Broomhilda, sa femme, dont il fut séparé à cause du commerce des esclaves…" +
			"Lorsque Django et Schultz arrivent dans l’immense plantation du puissant Calvin Candie, ils" +
			"éveillent les soupçons de Stephen, un esclave qui sert Candie et a toute sa confiance. " +
			"Le moindre de leurs mouvements est désormais épié par une dangereuse organisation " +
			"de plus en plus proche… Si Django et Schultz veulent espérer s’enfuir avec Broomhilda, " +
			"ils vont devoir choisir entre l’indépendance et la solidarité, entre le sacrifice et la survie..."
		));

		tmpMovies.push(this.generateMovieDescription("Inglourious Basterds", "tmp/images/inglourious_basterds.jpg", "2014-04-11", [28, 35], 
			"Dans la France occupée de 1940, Shosanna Dreyfus assiste à l'exécution de sa famille tombée " +
			"entre les mains du colonel nazi Hans Landa. Shosanna s'échappe de justesse et s'enfuit à " +
			"Paris où elle se construit une nouvelle identité en devenant exploitante d'une salle de cinéma." +
			"Quelque part ailleurs en Europe, le lieutenant Aldo Raine forme un groupe de soldats juifs " +
			"américains pour mener des actions punitives particulièrement sanglantes contre les nazis. " +
			"\"Les bâtards\", nom sous lequel leurs ennemis vont apprendre à les connaître, se joignent à " +
			"l'actrice allemande et agent secret Bridget von Hammersmark pour tenter d'éliminer les hauts" +
			"dignitaires du Troisième Reich. Leurs destins vont se jouer à l'entrée du cinéma où Shosanna " +
			"est décidée à mettre à exécution une vengeance très personnelle..."
		));

		tmpMovies.push(this.generateMovieDescription("Harry Potter et l'Ordre du Phénix", "tmp/images/harry_potter_5.jpg", "1882-12-12", [80, 14], 
			"Alors qu'il entame sa cinquième année d'études à Poudlard, Harry Potter découvre" +
			"que la communauté des sorciers ne semble pas croire au retour de Voldemort, " +
			"convaincue par une campagne de désinformation orchestrée par le Ministre de la " +
			"Magie Cornelius Fudge. Afin de le maintenir sous surveillance, Fudge impose à " +
			"Poudlard un nouveau professeur de Défense contre les Forces du Mal, Dolorès Ombrage, " +
			"chargée de maintenir l'ordre à l'école et de surveiller les faits et gestes de Dumbledore. " +
			"Prodiguant aux élèves des cours sans grand intérêt, celle qui se fait appeler la Grande " +
			"Inquisitrice de Poudlard semble également décidée à tout faire pour rabaisser Harry. " +
			"Entouré de ses amis Ron et Hermione, ce dernier met sur pied un groupe secret, " +
			"\"L'Armée de Dumbledore\", pour leur enseigner l'art de la défense contre les forces du " +
			"Mal et se préparer à la guerre qui s'annonce... "
		));

		this.updateData(
			"Films recommandés", 
			tmpMovies,
			null, null, true
		);
	};
*/

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

	/* Update des donnees pour afficher les films recommandés pour un utilisateur qui vient de s'inscrire */
	this.showInitialRecommandedMovies = function(){

		var user_categories = $("#user_categories").html();

		var user_categories_array = user_categories.split(",");
		for(var s = 0; s < user_categories_array.length; s++){
		    user_categories_array[s] = user_categories_array[s].toUpperCase();
		}

		var resultMovies = {
		    results: []
		};
		
		var popularMovies =  JSON.parse(getPopularMovies()).results;

		// si aucune catégorie préférée => afficer tous les films
		if(user_categories === 'undefined' || user_categories.length === 0) {
			resultMovies.results = popularMovies;
		} else {

			//pour chaque film de popularMovies
			for(var i in popularMovies)
			{
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
					}
				}
			}
		}

		if(resultMovies.results !== 'undefined' && resultMovies.results.length !== 0) {
			this.updateData(
				"Films recommandés pour vous", 
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
	this.showInitialRecommandedMovies();
});