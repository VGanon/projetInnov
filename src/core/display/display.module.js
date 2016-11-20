angular.module('display', [])
  .directive('htdRatedMovieCard', htdRatedMovieCard)
  .controller('displayCtrl', DisplayCtrl);

function DisplayCtrl($scope) {
  // Stub car pas d'accès au backend en ce moment
  $scope.stub = [
    {
      rater: {
        name: "Bastien"
      },
      title: "Harry Porter 1"
    },
    {
      rater: {
        name: "Bastien's brother"
      },
      title: "Harry Porter 10"
    },
    {
      rater: {
        name: "Bastien's sister"
      },
      title: "Harry Porter 100"
    }
  ];
  
}

function htdRatedMovieCard() {
  // Permet d'utiliser htdRatedMovieCard comme un attribut HTML.
  // templateUrl pointe vers la définition de sa vue.
  return {
    restrict: 'A',
    templateUrl: 'core/display/rated-movie-card.tpl.html'
  }
}