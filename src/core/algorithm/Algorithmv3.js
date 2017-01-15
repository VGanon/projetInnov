var userID = "";
var ratedMovies = [];
var ratedCrit = [];
var sortedRatedCrit = [];
var filmCount = new Object();
var finalMovies = [];
var randomRecommandation = [];
function getRecommandations(notes, userid){
  userID = userid;
  ratedMovies = [];
  ratedCrit = [];
  sortedRatedCrit = [];
  filmCount = new Object();
  finalMovies = [];
  randomRecommandation = [];
  var array = buildArray(notes, userID);
  console.log("1) Array");
  console.log(array);
  var map = buildMap(array);
  console.log("2) Map");
  console.log(map);
  console.log("3) Calcul des scores");
  var allCrit = computeScore(map);
  console.log(allCrit);
  findBestCritOfUser();
  var bestCrit = sortedRatedCrit[0];
  console.log("4) Meilleur critère de " + userID + " : " + bestCrit);
  var i = 0;
  var limit = 9;
  while(finalMovies.length < limit && i<13){
    console.log("Critère : " + bestCrit);
    sortByBestCrit(bestCrit, allCrit);
    i++;
    bestCrit = sortedRatedCrit[i];
  }
  console.log("5) Films recommandables");
  console.log(finalMovies);
  if(bestCrit == sortedRatedCrit[1]){
    console.log("Random en cours");
    randomize(limit);
  }
  else{
    randomRecommandation = finalMovies;
  }
  console.log("6) Films à recommander");
  console.log(randomRecommandation);
  return randomRecommandation;
}


function buildArray(notes, userID){
  var array = [];

  for(var i = 0; i < notes.length; i++){
    var note = notes[i];
    var id_film = note.local.id_movie;
    if(note.local.id_user == userID){
      ratedMovies.push(id_film);
    }
    if(filmCount[id_film] == null){
      filmCount[id_film] = 1;
    }
    else{
      filmCount[id_film]++;
    }
    for(var key in note.local.criteres){
      if(note.local.criteres[key] === true){
        array.push(id_film + "_" + key);
      }
      if(note.local.id_user == userID){
        ratedCrit.push(key);
      }
    }
  }
  return array;
}

function buildMap(array){
  var map = new Object();
  for(var i = 0; i < array.length; i++){
    var crit = array[i];
    if(map[crit] == null){
      map[crit] = 1;
    }
    else{
      map[crit]+=1;
    }
  }
  return map;
}

function computeScore(map){
  var result = [];
  for(var key in map){
    var movieId = key.split('_')[0];
    var score = (map[key] / filmCount[movieId]);
    if(score >= 0.75){
      result.push(key);
    }
  }
  return result;
}

function findBestCritOfUser(){
  var map = new Object();
  for(var i = 0; i < ratedCrit.length; i++){
    var crit = ratedCrit[i];
    if(map[crit] == null){
      map[crit] = 1;
    }
    else{
      map[crit]+=1;
    }
  }
  sortedRatedCrit = Object.keys(map)
  .sort(function(a,b) { return map[b] - map[a] });
}

function sortByBestCrit(bestCrit, sortedCrit){
  for(var i = 0; i < sortedCrit.length; i++){
    if(sortedCrit[i].indexOf(bestCrit) != -1){
      var movieId = sortedCrit[i].split('_')[0];
      if($.inArray(movieId, ratedMovies) == -1 && ($.inArray(movieId, finalMovies) == -1)){
        finalMovies.push(movieId);
      }
    }
  }
}

function randomize(limit){
  while(randomRecommandation.length < limit){
    var rand = finalMovies[Math.floor(Math.random() * finalMovies.length)];
    if($.inArray(rand, randomRecommandation) == -1){
      randomRecommandation.push(rand);
    }
  }
}
