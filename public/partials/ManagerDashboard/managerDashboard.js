'use strict';


angular.module('tutorialWebApp.managerDashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/managerDashboard', {
    templateUrl: 'partials/ManagerDashboard/managerDashboard.html',
    controller: 'managerDashboardCtrl'
  });
}])

.controller('managerDashboardCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("Manager Dashboard Controller reporting for duty.");
    

}]);