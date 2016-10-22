# Algo de recommandation général

1.  Utilisateur U1 note un ensemble de films. Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1. 

2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire : 
- pour chaque film, on calcule la somme des critères.
- L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement. 

3.  On prend les utilisateurs qui ont noté ce même film  

4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.
Résultat : on obtient les utilisateurs qui ont noté à l'identique ou presque le même film que U1.

5.  On trie ce tableau des utilisateurs trouvés par ordre décroissant  

6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs  

7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.  
    -> Si on obtient a en-dessous de 8 films, on recommence avec le deuxième meilleur film que U1 a aimé.
-> Si au bout de 3 itérations ce n'est pas satisfaisant, alors on passe à l'algo de substitution
7. (version moins lourd)
Pour chaque user on prend leur meilleur film que U1 n'a pas vu (si U1 l'a vu, passe à leur deuxième...n-ème meilleur).
  Si on obtient moins de 3 résultats, alors on passe à l'algo de substitution.

# Algo de substitution : par catégorie

On recommande les meilleurs films de chaque catégorie.  
Meilleur film = celui qui possède le plus de "1"

# Algo de recommandation selon les amis 
Le même algo que le général mais réalisé que sur les amis

# Algo de recommandation selon un ami
L'utilisateur accède à la page perso d'un ami et verra les films que son ami a vu et qui sont susceptibles de lui plaire.  
Cet algo est le même que le général mais on se base sur un seul user.
