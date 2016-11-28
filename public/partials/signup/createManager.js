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
    $scope.voters = {};

    $scope.user = {};

    $scope.voter = {};

    $scope.precincts = {};

    $scope.managerSuccess = false;
    $scope.voterNotFound = false;

    getVoters();
    getPrecincts();



    $scope.makeManager = function(){
      console.log($scope.user.precinct);
      $scope.voter['precinct'] = $scope.user.precinct;
      console.log($scope.voter);
      var ref = firebase.database().ref('managers/' +  $scope.hash);
      ref.set($scope.voter);

      var updates = {};
      updates['precincts/' + $scope.user.precinct + '/manager'] = $scope.hash;
      var up = firebase.database().ref().update(updates);
      
      var removalRef = firebase.database().ref('voters/' + $scope.hash);
      removalRef.remove().then(function(){
        $scope.voter = {};
        $scope.hash = '';
        $scope.managerSuccess = true;
        $scope.$apply();
      }).catch(function(error){
        console.log(error.message);
      });
    }

    $scope.search = function(){
      var email = $scope.user.email;
      $scope.hash = md5.createHash(email);
      var user = null;
      console.log($scope.hash);
      var ref = firebase.database().ref('voters/' + $scope.hash);
      $scope.voterNotFound = true;

      ref.once("value").then(function(snapshot){
        console.log("upinhere");
        console.log(snapshot.val());
        if(snapshot.val()!=null){
          $scope.voter = snapshot.val();
          $scope.voterNotFound = false;
        }else{
          $scope.voter = {};
        }
        $scope.$apply();

      });


    }

    function getPrecincts(){
      var ref = firebase.database().ref('precincts/');
      ref.once("value").then(function(snapshot){
          snapshot.forEach(function(childSnapshot){
              var key = childSnapshot.key;
              var data = childSnapshot.val();
              console.log(key);
              console.log(data);
              $scope.precincts[key] = data;
          })
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
