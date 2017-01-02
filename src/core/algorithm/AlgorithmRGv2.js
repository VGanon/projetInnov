var socket = io.connect("http://127.0.0.1:8080");
function getRecommandations(notes){
  buildCSV(notes);
}

// Point 2. On extrait les données de la table "NOTE" pour construire la liste suivante (au format CSV). Cette liste contient l'id des users ainsi que les critères qu'ils ont aimé
// (critère précédé de l'id du film). Les utilisateurs peuvent être tous les utilisateurs (max de 10000 pour ne pas surcharger les calculs), seulement les amis de U1 ou seulement
// un seul ami de U1.

function buildCSV(notes){
  var actualUser = notes[0].local.id_user;
  var csvContent = actualUser + ",";

  for(var i = 0; i < notes.length; i++){
    if(actualUser != notes[i].local.id_user){
      actualUser = notes[i].id_user;
      csvContent = csvContent + "\n" + actualUser + ",";
    }
    var note = notes[i];
    var id_film = note.local.id_movie;
    for(var key in note.local.criteres){
      if(note.local.criteres[key] === true){
        csvContent = csvContent + id_film + "_" + key + ",";
      }
    }
  }
  csvContent = csvContent.substring(0, csvContent.length - 1);
  socket.emit('buildCSV', csvContent);
  $("#csvContent").text(csvContent);
}

// Point 3 : On fait appel à l'algorithme de Apriori en indiquant une confiance et un support minimal. Celui-ci nous renvoie une liste de pseudos-dépendances fonctionnelles au format
//  JSON, du type : "a { "lhs" : "14186_Scénario", "rhs" : "2586_Décors" } --> ". Cela signifie que la plupart des gens qui aiment le scénario du film 14186 aiment les décors du
//  film 2586.
socket.on('aprioriResults', function(results){
  apriori(results);
});
function apriori(results) {
  console.log(results);
}
