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

## Algo de recommandation général. Filtrage de la liste des users et/ou de la liste des films possible :)

Point 1.  Utilisateur U1 note un ensemble de films. Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). Si l'utilisateur a aimé un critère dans ce film, cela équivaut à passer ce critère à 1. S'il ne l'a pas aimé, le critère est à 0. 

Point 2.  On extrait les données de la table "NOTE" pour construire la liste suivante (au format CSV OU tableau JS, à voir après les tests selon la librairie retenue). Cette liste contient l'id du user ainsi que les critères qu'il a aimé (critère précédé de l'id du film).
<table>
    <tr>
        <th>123</th>
        <td>14186_Scénario</td>
        <td>14186_Réalisation</td>
        <td>14186_Costumes</td>
        <td>14186_Narration</td>
        <td>2586_Décors</td>
        <td>2586_Ambiance</td>
        <td>2586_Rythme</td> 
    </tr>
    <tr>
        <th>124</th>
        <td>14186_Scénario</td>
        <td>14186_Réalisation</td>
        <td>14186_Décors</td>
        <td>2586_Décors</td>
        <td>2586_Ambiance</td>
        <td>2586_Rythme</td>   
    </tr>
</table>

Point 3 : On fait appel à l'algorithme de Apriori. Celui-ci nous renvoie des pseudos-dépendances fonctionnelles, du type "14186_Scénario --> 2586_Décors". Cela signifie que les gens qui aiment le scénario du film 14186 aiment les décors du film 2586. On classe les règles selon leur indice de confiance.

Point 4 : Enfin, on regarde les films que U1 a aimé et on cherche des règles en relation avec ces films. 
Exemple : U1 aime Terminator d'identifiant 5247. On regarde les règles (de la plus confiante à la moins confiante) qui contiennent à gauche un "5247". On regarde le film que ces rèles impliquent et on vérifie que U1 n'a pas déjà vu ce film. Dans ce cas, on l'ajoute aux recommandations.


