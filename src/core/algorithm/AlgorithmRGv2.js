var socket = io.connect("http://127.0.0.1:8080");
function getRecommandations(){
  socket.emit('getNotes', "all");
  //var csvFile = buildCSV(users);
}
socket.on('getNotes', function(data){
  console.log(data);
  buildCSV(data);
});
// Point 2. On extrait les données de la table "NOTE" pour construire la liste suivante (au format CSV). Cette liste contient l'id des users ainsi que les critères qu'ils ont aimé
// (critère précédé de l'id du film). Les utilisateurs peuvent être tous les utilisateurs (max de 10000 pour ne pas surcharger les calculs), seulement les amis de U1 ou seulement
// un seul ami de U1.

function buildCSV(notes){
  var actualUser = notes[0].user_id;
  var csvContent = actualUser + ",";

  for(var i = 0; i < notes.length; i++){
    if(actualUser != notes[i].user_id){
      actualUser = notes[i].user_id;
      csvContent = csvContent + "\n" + actualUser + ",";
    }
    var note = notes[i];
    var id_film = note.id_film;

    for(var j=0; j<note.criteres.length; j++){
      var critere = note.criteres[j];
      if(Object.values(critere)[0] === true){
        csvContent = csvContent + id_film + "_" + Object.keys(critere)[0] + ",";
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
