'use strict';


angular.module('tutorialWebApp.voterDashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/voterDashboard', {
    templateUrl: 'partials/VoterDashboard/voterDashboard.html',
    controller: 'voterDashboardCtrl'
  });
}])

.controller('voterDashboardCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("Voter Dashboard Controller reporting for duty.");
    

}]);