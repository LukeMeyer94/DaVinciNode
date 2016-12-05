'use strict';


angular.module('tutorialWebApp.signup', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'partials/signup/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('SignUpCtrl', ['$scope', 'md5','$location','$rootScope','$window','$firebaseAuth',
    function ($scope, md5, $location, $rootScope, $window, $firebaseAuth) {
    console.log("SignUp Controller reporting for duty.");
    // closing nav bar on any page change
    $('.navbar-collapse').removeClass('in');

    $scope.months = {"January": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                      "February":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
                      "March":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                      "April": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
                      "May":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                      "June":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
                      "July":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                      "August":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                      "September":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
                      "October":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
                      "November":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
                      "December":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]}
    $scope.years = [];


    var thisYear = new Date().getFullYear();
    console.log(thisYear);
    for(var i = 1940; i<=thisYear;i++){
      $scope.years.push(i);
    }
    function registerUser(email, password, birthday, zipcode, ssn, licenseNumber,firstName,lastName){
        console.log("Register User function");
        var success = true;

            firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error){
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error1: " + errorMessage);//TODO: add something here to do a fancy pop up if error is thrown
                $scope.available_email = false;
                $scope.$apply();
                success = false;
                return false;
            }).then(function(){

             //console.log("successfully authorized user");

            //sign in newly authorized user
            /*firebase.auth().signInWithEmailAndPassword(email, password)
            console.log("successfully signed in new user");
            */
            if(success==true){
                email = email.toLowerCase();//firebase stores emails non-case-sensitive: this is so we can use auth().currentUser;
                var hash = md5.createHash(email);
                firebase.database().ref('voters/' + hash).set({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    birthday: birthday,
                    zipcode: zipcode,
                    ssn: ssn,
                    licenseNumber: licenseNumber
                });
                console.log("where i'm not supposed to be");
            }});

        return success;
    }
    $scope.signUp = function(){
        var email = $scope.user.email;
        //var email2= $scope.user.email2;

        var password = $scope.user.password;
        //var password2= $scope.user.password2;

        var birthday = $scope.user.birthday;

        var zipcode = $scope.user.zipcode;

        var ssn = $scope.user.ssn;

        var licenseNumber = $scope.user.license;
        var firstName = $scope.user.firstName;
        var lastName = $scope.user.lastName;
        console.log(firstName);
        console.log(lastName);
        console.log($scope.user.birthday);
        var registered = registerUser(email, password, birthday, zipcode, ssn, licenseNumber,firstName,lastName);
        console.log(registered);
        var genID = function(){
            var updates = {};
            var key = firebase.database().ref('voterIDs/').push().key;
            console.log(key);
            updates['voterIDs/' + key] = true;
            firebase.database().ref().update(updates);
            return key;
        };
        if(registered){
            //var id = genID();
            var key = firebase.database().ref('voterIDs/').push().key;
            var ref = firebase.database().ref('voterIDs/' + key).set({
                    zipcode: zipcode
                }).catch(function(error){
                  var errorcode = error.code;
                  var errorMessage = error.message;
                  console.log("Error3: " + errorMessage);
                });
            var data = {
                email: email,
                id: key,
                zipcode: zipcode
            };
            socket.emit('send email', data);

            console.log("All successful");
            //;$location.url('/');
        }else{
            console.log("failed");
        }

        $scope.user.email = '';
        $scope.user.password = '';
    };
}]);
