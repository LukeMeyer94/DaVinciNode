'use strict';


angular.module('tutorialWebApp.signup', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'partials/signup/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('VotingCtrl', ['$scope', '$firebaseAuth', function ($scope, $firebaseAuth) {
    console.log("Voting Controller reporting for duty.");
    var config = {
    apiKey: "AIzaSyCD7DbVChVXmOcz16guCkBOWQRY5Qjnv6E",
    authDomain: "davincinode-5e249.firebaseapp.com",
    databaseURL: "https://davincinode-5e249.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "517875679155"
    };
    firebase.initializeApp(config);

}]);
