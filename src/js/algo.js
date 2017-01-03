$(document).ready(function() {
  var notes = JSON.parse($("#notes").html());
  var userID = $("#userID").html();
  getRecommandations(notes, userID);
});
