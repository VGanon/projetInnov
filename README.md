# Algo de recommandation général

1.  Utilisateur U1 note un ensemble de films.  

2.  L'algo choisit le film que l'utilisteur a le plus aimé, c'est à dire le max des sommes des critères de chaque films  

3.  On prend les utilisateurs qui ont noté ce même film  

4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.

5.  On trie ce tableau par ordre décroissant  

6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs  

7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.  
    -> On obtient en résultat 10 films à recommender. Si jamais on n'a pas 10 films, on recommence depuis le début du tableau jusqu'à avoir 10 films.


# Algo de substitution : par catégorie

On recommande les meilleurs films de chaque catégorie.  
note d'un utilisateur =
moyenne d'un critère d'un film = somme des notes de chaque utilisateur sur ce critère / nombre de notes  
moyenne d'un film = somme des critères / nombre de critères

# Algo de recommandation selon les amis 
Le même algo que le général mais réalisé que sur les amis

# Algo de recommandation selon un ami
L'utilisateur accède à la page perso d'un ami et verra les films que son ami a vu et qui sont susceptibles de lui plaire.  
Cet algo est le même que le général mais on se base sur un seul user.
