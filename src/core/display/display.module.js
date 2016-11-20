angular.module('display', [])
  .directive('htdRatedMovieCard', htdRatedMovieCard)
  .controller('displayCtrl', DisplayCtrl);

function DisplayCtrl($scope) {
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
  return {
    restrict: 'A',
    templateUrl: 'core/display/rated-movie-card.tpl.html'
  }
}