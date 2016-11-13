'use strict';


angular.module('tutorialWebApp.voting', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/voting', {
    templateUrl: 'partials/voting/voting.html',
    controller: 'VotingCtrl'
  });
}])

.controller('VotingCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("Voting Controller reporting for duty.");
    
}]);
