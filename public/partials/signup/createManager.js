'use strict';

angular.module('tutorialWebApp.createManager', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createManager', {
    templateUrl: 'partials/signup/createManager.html',
    controller: 'createManagerCtrl'
  });
}])

.controller('createManagerCtrl', ['$scope','md5', '$firebaseAuth','$route','$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $route, $location, $rootScope, $window) {
    console.log("createManager Controller reporting for duty.");
    
}]);
