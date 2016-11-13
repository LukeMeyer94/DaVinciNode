'use strict';


angular.module('tutorialWebApp.adminDashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/adminDashboard', {
    templateUrl: 'partials/AdminDashboard/adminDashboard.html',
    controller: 'adminDashboardCtrl'
  });
}])

.controller('adminDashboardCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("Admin Dashboard Controller reporting for duty.");
    

}]);