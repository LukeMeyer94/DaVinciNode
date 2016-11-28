'use strict';


angular.module('tutorialWebApp.voterDashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/voterDashboard', {
    templateUrl: 'partials/VoterDashboard/voterDashboard.html',
    controller: 'voterDashboardCtrl'
  });
}])

.controller('voterDashboardCtrl', ['$scope', 'md5','$location', '$route', '$firebaseAuth', function ($scope, md5, $location, $route, $firebaseAuth) {
    console.log("Voter Dashboard Controller reporting for duty.");

    $scope.voter = {

    }

    $scope.elections = {

    }

    $scope.showAlert = false;

    $scope.vote = function(key){
      var updates = {};
      updates['voters/' + $scope.hash + '/votes/' + key] = true;
      console.log(updates);
      $location.url('/voting/' + key);
      $route.reload();
      //var up = firebase.database().ref().update(updates);
    }

    function getElections(){
      var ref = firebase.database().ref('elections');
      ref.once("value").then(function(snapshot){
        snapshot.forEach(function(election){
          console.log(election.val());
          if(election.val().status === 'IP'){
            console.log("election is IP");
            if(election.val().raceLevel === 'National'){
              console.log("election is National");
              $scope.elections[election.key] = election.val();
              $scope.$apply();
            }else if(election.val().raceLevel === 'State'){
              console.log("election is State");
              var stateRef = firebase.database().ref('states/' + election.val().state);
              stateRef.once("value").then(function(state){
                var range = state.child('zipcodes').val();
                var startZip = range.split('-')[0];
                var endZip = range.split('-')[1];

                if($scope.zipcode >= startZip && $scope.zipcode <= endZip){
                  $scope.elections[election.key] = election.val();
                  $scope.$apply();
                }
              })
            }else if(election.val().raceLevel === 'Precinct'){
              var precinctRef = firebase.database().ref('precincts/' + election.val().precinct);
              precinctRef.once("value").then(function(precinct){
                var range = precinct.child('zipcodes').val();
                var startZip = range.split('-')[0];
                var endZip = range.split('-')[1];

                if($scope.zipcode >= startZip && $scope.zipcode <= endZip){
                  $scope.elections[election.key] = election.val();
                  $scope.$apply();
                }
              })
            }
          }
        })
      })
    }

    function getData(){
      $scope.hash = md5.createHash($scope.voter.email);
      console.log($scope.hash);
      var ref = firebase.database().ref('voters/' + $scope.hash);
      ref.once("value").then(function(snapshot){
        $scope.zipcode = snapshot.child('zipcode').val();
        console.log($scope.zipcode);
      }).then(function(){
        console.log("getData done");
        getElections();
      })
    }

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $scope.voter.email = user.email;
        $scope.$apply();
        console.log("auth state changed");
        getData();
        //getElections();
      }
    });


}]);
