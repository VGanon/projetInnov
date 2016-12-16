# Installation des modules
- go to src directory
- `npm install`
- `npm install -g karma`
- `npm install -g karma-cli`
- `npm install -g jasmine-core`
- facultatif : `webpack --watch`

# Technologies utilisées
- Node.js
- MongoDB
- Express
- Socket.io
- Bootstrap

# Prérequis
- Node.js installé
- MongoDB installé

# Utilisation
1. Lancer la bdd mongo locale avec la commande suivante : `mongod`
2. Lancer un terminal et se placer dans le répertoire src
3. Lancer le serveur node avec cette commande : `node server.js`
4. Puis dans le navigateur allez ici : [http://localhost:8080](http://localhost:8080)

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

### Remarque : utiliser l'algo dés l'inscription
Amis : Suivre à la Twitter ? Comment follow quelqu'un
Point 1.  Utilisateur U1 note un ensemble de films. Chaque film possède plusieurs critères (acteurs, effets spéciaux, etc). Si l'utilisateur a aimé un critère dans ce film, cela équivaut à passer ce critère à 1. S'il ne l'a pas aimé, le critère est à 0. 

Point 2.  On extrait les données de la table "NOTE" pour construire la liste suivante (au format CSV). Cette liste contient l'id des users ainsi que les critères qu'ils ont aimé (critère précédé de l'id du film). Les utilisateurs peuvent être tous les utilisateurs, seulement les amis de U1 ou seulement un seul ami de U1.
<h3>Fichier CSV</h3>
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
     <tr>
        <th>125</th>
        <td>14186_Scénario</td>
        <td>14186_SFX</td>
        <td>14186_Décors</td>
        <td>2586_Décors</td>
        <td>2586_Ambiance</td>
        <td>2586_Rythme</td>  
        <td>2586_Scénario</td>
        <td>666_SFX</td>
        <td>666_Scénario</td>
    </tr>
</table>

Point 3 : On fait appel à l'algorithme de Apriori en indiquant une confiance et un support minimal. Celui-ci nous renvoie une liste de pseudos-dépendances fonctionnelles au format JSON, du type :
"a {
    "lhs" : "14186_Scénario",
    "rhs" : "2586_Décors"
} --> ". Cela signifie que la plupart des gens qui aiment le scénario du film 14186 aiment les décors du film 2586.

Point 4 : On calcule le "lift" de chaque règle retournée par l'algorithme. 
Soit la règle R1 = "14186_Scénario --> 2586_Décors". 
lift(R1) = P(14186_Scénario /\ 2586_Décors) / P(14186_Scénario) * P(2586_Décors).
Si la valeur du lift est inférieure à 1, on ne garde pas la règle. On conserve les meilleures règles (les règles qui ont le plus grand lift). 

Point 5 : On effectue un filtrage sur cette liste de meilleures règles selon la liste des films qu'a notés U1. "lhs" ne doit contenir que des critères relatifs à un film déjà noté par U1 et "rhs" ne doit contenir qu'un critère relatif à un film pas vu par U1 et différent de celui présent dans "lhs". 

Point 6 : Les films situés dans la partie "rhs" sont recommandables pour U1, après suppression des éventuels doublons.

# Collaborateurs
- Aden Baptiste
- Belhacel Thomas
- Hoang Tuan-Dung
- Jezequel Yannick
- Quettier Alexandre
- Romdhane Amira
- Vion Benjamin