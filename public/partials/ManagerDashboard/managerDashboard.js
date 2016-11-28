'use strict';


angular.module('tutorialWebApp.managerDashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/managerDashboard', {
    templateUrl: 'partials/ManagerDashboard/managerDashboard.html',
    controller: 'managerDashboardCtrl'
  });
}])

.controller('managerDashboardCtrl', ['$scope','md5', '$firebaseAuth', function ($scope, md5, $firebaseAuth) {
    console.log("Manager Dashboard Controller reporting for duty.");

    $scope.birthday = '';
    $scope.email = '';
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.licenseNumber = '';
    $scope.precinct = '';
    $scope.ssn = '';
    $scope.zipcode = '';

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $scope.email = user.email;
        $scope.$apply();
        getData();
      }
    });

    function getData(){
    //  var email = firebase.auth().currentUser;
      console.log($scope.email);
      var hash = md5.createHash($scope.email);
      var ref = firebase.database().ref('managers/'  + hash);
      console.log(hash);
      ref.once("value").then(function(snapshot){
        $scope.birthday = snapshot.child('birthday').val();
        console.log($scope.birthday);
        $scope.firstName = snapshot.child('firstName').val();
        console.log($scope.firstName);
        $scope.lastName = snapshot.child('lastName').val();
        console.log($scope.lastName);
        $scope.licenseNumber = snapshot.child('licenseNumber').val();
        console.log($scope.licenseNumber);
        $scope.precinct = snapshot.child('precinct').val();
        console.log($scope.precinct);
        $scope.ssn = snapshot.child('ssn').val();
        console.log($scope.ssn);
        $scope.zipcode = snapshot.child('zipcode').val();
        console.log($scope.zipcode);

        
      })
    }
}]);
