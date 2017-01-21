var userID = "";
var ratedMovies = [];
var ratedCrit = [];
var sortedRatedCrit = [];
var filmCount = new Object();
var finalMovies = [];
var randomRecommandation = [];
function getRecommandations(notes, userid, users){
  userID = userid;
  ratedMovies = [];
  ratedCrit = [];
  sortedRatedCrit = [];
  filmCount = new Object();
  finalMovies = [];
  randomRecommandation = [];
  console.time('buildArray');
  var array = buildArray(notes, userID, users);
  console.timeEnd('buildArray');
  if(ratedMovies.length == 0){
    return randomRecommandation;
  }
  console.time('buildMap');
  var map = buildMap(array);
  console.timeEnd('buildMap');
  console.time('computeScore');
  var allCrit = computeScore(map);
  console.timeEnd('computeScore');
  console.time('findBestCritOfUser');
  findBestCritOfUser();
  console.timeEnd('findBestCritOfUser');
  var bestCrit = sortedRatedCrit[0];
  var i = 0;
  var limit = 15;
  console.time('whileFinal');
  while(finalMovies.length < limit && i<13){
    sortByBestCrit(bestCrit, allCrit);
    i++;
    bestCrit = sortedRatedCrit[i];
  }
  console.timeEnd('whileFinal');
  if(bestCrit == sortedRatedCrit[1]){
    console.time('randomize')
    randomize(limit);
    console.timeEnd('randomize')
  }
  else{
    randomRecommandation = finalMovies;
  }
  return randomRecommandation;
}


function buildArray(notes, userID,users){
  var array = [];

  for(var i = 0; i < notes.length; i++){
    var note = notes[i];
    var id_film = note.local.id_movie;
    var id_user_note = note.local.id_user;
    if(filmCount[id_film] == null){
      filmCount[id_film] = 1;
    }
    else{
      filmCount[id_film]++;
    }
    if(id_user_note == userID){
      ratedMovies.push(id_film);
    }
    for(var key in note.local.criteres){
      if(note.local.criteres[key] === true){
        if(users != "all" && ($.inArray(id_user_note, users) != -1)){
          array.push(id_film + "_" + key);
        }
        else if(users == "all"){
          array.push(id_film + "_" + key);
        }  
      }
      if(id_user_note == userID){
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
