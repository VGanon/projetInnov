var socket = io.connect("http://127.0.0.1:8080");
var userID = "";
var ratedMovies = [];
function getRecommandations(notes, userID){
  userID = userID;
  buildCSV(notes);
}
var csvContent = "";
// Point 2. On extrait les données de la table "NOTE" pour construire la liste suivante (au format CSV). Cette liste contient l'id des users ainsi que les critères qu'ils ont aimé
// (critère précédé de l'id du film). Les utilisateurs peuvent être tous les utilisateurs (max de 10000 pour ne pas surcharger les calculs), seulement les amis de U1 ou seulement
// un seul ami de U1.

function buildCSV(notes){
  var actualUser = notes[0].local.id_user;
  csvContent = actualUser + ",";

  for(var i = 0; i < notes.length; i++){
    if(actualUser != notes[i].local.id_user){
      csvContent = csvContent.substring(0, csvContent.length - 1);
      actualUser = notes[i].local.id_user;
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


socket.on('aprioriResults', function(results){
  apriori(results);
  $("#aprioriResults").text(JSON.stringify(results));
});
//Point 4 : On calcule le "lift" de chaque règle retournée par l'algorithme. Soit la règle R1 = "14186_Scénario --> 2586_Décors". lift(R1) = P(14186_Scénario /\ 2586_Décors)
// / P(14186_Scénario) * P(2586_Décors). Si la valeur du lift est inférieure à 1, on ne garde pas la règle. On conserve les meilleures règles (les règles qui ont le plus
// grand lift).
function apriori(results) {
  var goodRules = [];
  for(var i = 0; i <results.length;i++){
    var lhs = [];
    for(var key in results[i].lhs){
      lhs.push(results[i].lhs[key]);
    }
    var rhs = results[i].rhs[0];
    var liftResult = lift(lhs, rhs);
    if(liftResult>1){
      goodRules.push(results[i]);
    }
  }
  $("#liftResults").text(JSON.stringify(goodRules));
  var finalResults = checkAndSort(goodRules);
  $("#finalResults").text(JSON.stringify(finalResults));

}

function lift(lhs, rhs){
  var lines = csvContent.split('\n');
  var lhsCount = 0;
  var rhsCount = 0;
  var lhsAndrhsCount = 0;
  var total = 0;
  for(var i = 0;i < lines.length;i++){
    var elements = lines[i].split(',');
    total+=elements.length-1;
    if(elements[0] == userID){
      var notes = elements;
      for(var k = 0; k < notes.length; k++){
        var movieId = notes[k].split('_')[0];
        if(ratedMovies.indexOf(movieId) == -1){
          ratedMovies.push(movieId);
        }
      }
    }
    if(containsAll(lhs, elements)){
      lhsCount++;
    }

    if(elements.indexOf(rhs)>-1){
      rhsCount++;
    }
    lhs.push(rhs);
    if(containsAll(lhs, elements)){
      lhsAndrhsCount++;
    }
  }
  var Plhs = lhsCount/total;
  var Prhs = rhsCount/total;
  var Plhsandrhs = lhsAndrhsCount/total;
  return (Plhsandrhs/(Plhs*Prhs));
}

function containsAll(needles, haystack){
  for(var i = 0 , len = needles.length; i < len; i++){
     if($.inArray(needles[i], haystack) == -1) return false;
  }
  return true;
}

function checkAndSort(rules){
  var finalRules = [];
  for(var i = 0; i < rules.length; i++){
    if(checkRule(rules[i])){
      finalRules.push(rules[i]);
    }
  }
  return finalRules;
}

function checkRule(rule){
  var movieId = rule.lhs[0].split('_')[0];
  for(var key in rule.lhs){
    if(rule.lhs[key].split('_')[0] != movieId){
      return false;
    }
  }
  if(rule.rhs[0].split('_')[0] == movieId){
    return false;
  }
  if(ratedMovies.indexOf(movieId) == -1){
    return false;
  }
  if(ratedMovies.indexOf(rule.rhs[0]) > -1){
    return false;
  }
  return true;
}
