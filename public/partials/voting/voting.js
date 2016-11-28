'use strict';


angular.module('tutorialWebApp.voting', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/voting/:race', {
    templateUrl: 'partials/voting/voting.html',
    controller: 'VotingCtrl'
  });
}])

.controller('VotingCtrl', ['$scope', '$location','md5', '$firebaseAuth', function ($scope,$location, md5, $firebaseAuth) {
    console.log("Voting Controller reporting for duty.");
    // closing nav bar on any page change
    $('.navbar-collapse').removeClass('in');

    // closing nav bar on any page change
    $scope.$on('$locationChangeStart', function(event) {
      console.log("page change");
        if($('.navbar-collapse').hasClass('in')){
          $('.navbar-collapse').removeClass('in');
        }
    });

    $scope.url = $location.url().split('/')[2];

    $scope.election = {

    }

    getData();

    function getData(){
      var ref = firebase.database().ref('elections/' + $scope.url);
      console.log("get Data");
      ref.once("value").then(function(snapshot){
        $scope.election.Name = snapshot.child('electionName').val();
        $scope.election.Description = snapshot.child('description').val();
        $scope.election.candidate1 = snapshot.child('candidate1').val();
        $scope.election.candidate2 = snapshot.child('candidate2').val();
        $scope.election.level = snapshot.child('raceLevel').val();
        $scope.election.raceName = snapshot.child('raceName').val();
        $scope.election.status = snapshot.child('status').val();
        $scope.$apply();
        console.log($scope.election);

      }).then(function(){
        console.log("wtf");
        console.log($scope.election.candidate1);
        console.log($scope.election.candidate2);
        var hash1 = md5.createHash($scope.election.candidate1);
        var hash2 = md5.createHash($scope.election.candidate2);
        console.log(hash1);
        console.log(hash2);
        var ref = firebase.database().ref('Candidates');
        ref.once("value").then(function(snapshot){
          $scope.cand1 = snapshot.child(hash1).val();
          $scope.cand2 = snapshot.child(hash2).val();
          $scope.$apply();
          console.log($scope.cand1);
          console.log($scope.cand2);
        })
      })
    }
}]);
