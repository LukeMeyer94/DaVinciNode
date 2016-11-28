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

    $scope.voters = {};

    $scope.user = {};

    $scope.voter = {};

    $scope.adminSuccess = false;

    getVoters();

    $scope.makeAdmin = function(){
      var ref = firebase.database().ref('admins/' +  $scope.hash);
      ref.set($scope.voter);

      var removalRef = firebase.database().ref('voters/' + $scope.hash);
      removalRef.remove().catch(function(error){
        console.log(error.message);
      });

      $scope.voter = {};
      $scope.hash = '';
      $scope.adminSuccess = true;
      $scope.$apply();
    }

    $scope.search = function(){
      var email = $scope.user.email;
      $scope.hash = md5.createHash(email);
      var user = null;
      console.log($scope.hash);
      var ref = firebase.database().ref('voters/' + $scope.hash);
      ref.once("value").then(function(snapshot){
        console.log("upinhere");
        $scope.voter = snapshot.val();
        $scope.$apply();
      });


    }


    function getVoters(){
      var ref = firebase.database().ref('voters/');
      ref.once("value").then(function(snapshot){
        $scope.voters = snapshot.val();
      });
    }
}]);
