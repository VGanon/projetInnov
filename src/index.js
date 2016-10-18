angular.module('filmApp', []).controller('FilmController', function() {
	var filmList = this;
	//TODO : utiliser l'algo pour charger la liste des films.
	//filmList.films = algo();
	//En attendant, valeur en dur.
	filmList.films = [];
	var filmIds = 0;
	
	filmList.generateFilmDescription = function(title, producer, imgUrl, rank, descrip, criterias){
		filmIds++;
		return {
			"id": filmIds,
			"title": title,
			"producer": producer,
			"description": descrip,
			"imgUrl": imgUrl,
			"rank": rank,
			"criterias": criterias
		};
	}

	filmList.films.push(filmList.generateFilmDescription("Django Unchained", "Quentin Tarantino", "../tmp/images/django_unchained.jpg", 1, 
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

	filmList.films.push(filmList.generateFilmDescription("Inglourious Basterds", "Quentin Tarantino", "../tmp/images/inglourious_basterds.jpg", 2, 
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

	filmList.films.push(filmList.generateFilmDescription("Harry Potter et l'Ordre du Phénix", "J. K. Rowling, David Yates", "../tmp/images/harry_potter_5.jpg", 3, 
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
});