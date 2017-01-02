$(document).ready(function() {
  var notes = JSON.parse($("#notes").html());
  getRecommandations(notes);
});
