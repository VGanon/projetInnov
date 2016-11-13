# Algo première version

## Algo de recommandation général

Point 1.  Utilisateur U1 note un ensemble de films. Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1. 

Point 2.  L'algo choisit le film que l'utilisteur a le plus aimé (à préciser), c'est à dire : 
- pour chaque film, on calcule la somme des critères.
- L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement. 

Point 3.  On prend les utilisateurs qui ont noté ce même film  

Point 4.  On calcule la somme d'un NON XOR entre la note du film de U1 et la note de chaque autre utilisateur.
Résultat : on obtient les utilisateurs qui ont noté à l'identique ou presque le même film que U1.

Point 5.  On trie ce tableau des utilisateurs trouvés par ordre décroissant  

Point 6.  On prend les 10 premiers résultats du tableau, ce qui correspond à 10 utilisateurs  

Point 7.  Pour chaque user on choisit le film avec la meilleure somme des critères et que U1 n'a pas vu.  
    -> Si on obtient a en-dessous de 8 films, on recommence avec le deuxième meilleur film que U1 a aimé.
-> Si au bout de 3 itérations ce n'est pas satisfaisant, alors on passe à l'algo de substitution
Point 7. (version moins lourd)
Pour chaque user on prend leur meilleur film que U1 n'a pas vu (si U1 l'a vu, passe à leur deuxième...n-ème meilleur).
  Si on obtient moins de 3 résultats, alors on passe à l'algo de substitution.

## Algo de recommandation : par catégorie

On recommande les meilleurs films de chaque catégorie.  
Meilleur film = celui qui possède le plus de "1"

## Algo de recommandation selon les amis 
Le même algo que le général mais réalisé que sur les amis

## Algo de recommandation selon un ami
L'utilisateur accède à la page perso d'un ami et verra les films que son ami a vu et qui sont susceptibles de lui plaire.  
Cet algo est le même que le général mais on se base sur un seul user.

# Algo deuxième version : règles d'association

## Algo de recommandation général

Point 1.  Utilisateur U1 note un ensemble de films. Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). Si l'utilisateur a aimé un critère dans ce film, il passe ce critère à 1. 

Point 2.  L'algo choisit le film BEST_MOVIE que l'utilisteur a le plus aimé (à préciser), c'est à dire : 
- pour chaque film, on calcule la somme des critères.
- L'algo choisit la somme maximale ce qui correspond à ce que l'utilisateur a le plus aimé objectivement. 

Point 3.  On prend les utilisateurs qui ont noté ce même film. Parmi cette liste, on sélectionne ceux qui ont le plus aimé ce BEST_MOVIE. Score minimal requis pour faire parti de la liste : 7 critères aimés sur les 13. 

Point 4 : Pour chaque utilisateur, on construit la matrice suivante.
<table>
    <tr>
        <th>Critères</th>
        <th>Terminator</th>
        <th>Le Pont des Espions</th>
        <th>Le Père Noël est une ordure</th>
        <th>etc</th>
    </tr>
    <tr>
        <th>Scénario</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>...</td>
    </tr>
    <tr>
        <th>Jeu d'acteurs</th>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>...</td>
    </tr>
    <tr>
        <th>Réalisation</th>
        <td>1</td>
        <td>1</td>
        <td>0</td>
        <td>...</td>
    </tr>
    <tr>
        <th>Bande son</th>
        <td>1</td>
        <td>1</td>
        <td>0</td>
        <td>...</td>
    </tr>
    <tr>
        <th>etc</th>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
    </tr>
</table>

Cette matrice se construit à l'aide de listes. Voir le readme de https://github.com/dmarges/apriori.

Point 5 : Faire appel à l'algo Apriori avec un indice de support et de confiance minimal _à fixer_. Cet algo va retourner les règles d'associations les plus pertinentes. Dans notre exemple, il peut retourner "Terminator -> Le pont des espions" ce qui veut dire qu'il est fort probable que notre U1 qui adore Terminator va également adorer Le pont des espions.

Point 6 : on rassemble les résultats les plus pertinents de chaque utilisateur dans une liste de recommandations, après suppression des potentiels doublons.

# TODO : algorithme de recommandation par catégorie
