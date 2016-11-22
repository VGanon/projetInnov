/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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

/***/ }
/******/ ]);