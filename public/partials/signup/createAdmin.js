'use strict';


angular.module('tutorialWebApp.createAdmin', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createAdmin', {
    templateUrl: 'partials/signup/createAdmin.html',
    controller: 'createAdminCtrl'
  });
}])

.controller('createAdminCtrl', ['$scope','md5', '$firebaseAuth','$route','$location', '$rootScope', '$window', 
    function ($scope,md5, $firebaseAuth, $route, $location, $rootScope, $window) {
    console.log("createAdmin Controller reporting for duty.");
    
}]);


