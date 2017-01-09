var socket = io.connect("http://127.0.0.1:2222");
var userID = "";
var ratedMovies = [];
var ratedCrit = [];
var sortedRatedCrit = [];
var filmCount = new Object();

function getRecommandations(notes, userid){
  userID = userid;
  var array = buildArray(notes);
  console.log("1) Array");
  console.log(array);
  var map = buildMap(array);
  console.log("2) Map");
  console.log(map);
  var sortedCrit = computeScore(map);
  console.log("3) Calcul des scores");
  console.log(sortedCrit);
  findBestCritOfUser();
  var bestCrit = sortedRatedCrit[0];
  console.log("4) Meilleur critère de " + userID + " : " + bestCrit);
  var finalMovies = [];
  var i = 0;
  while(finalMovies.length < 1 && i<13){
    finalMovies = sortByBestCrit(bestCrit, sortedCrit);
    i++;
    bestCrit = sortedRatedCrit[i];
  }
  console.log("5) Films à recommander (sans check)");
  console.log(finalMovies);
  return finalMovies;
}


function buildArray(notes){
  console.log(notes);
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
  var result = new Object();
  for(var key in map){
    var movieId = key.split('_')[0];
    result[key] = (map[key] / filmCount[movieId]);
  }
  var sortedKeys = Object.keys(result)
  .sort(function(a,b) { return result[b] - result[a] });
  return sortedKeys;
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

  var finalMovies = [];
  for(var i = 0; i < sortedCrit.length; i++){
    if(sortedCrit[i].indexOf(bestCrit) != -1){
      var movieId = sortedCrit[i].split('_')[0];
      console.log(movieId);
      if($.inArray(movieId, ratedMovies) == -1){
        finalMovies.push(movieId);
      }
    }
  }

  return finalMovies;
}
