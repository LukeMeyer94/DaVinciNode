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

    function registerUser(email, password, birthday, zipcode, ssn, licenseNumber,firstName,lastName){
        console.log("Register User function");
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error){//this error checking should catch already exists type stuff
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("Error: " + errorMessage);//TODO: add something here to do a fancy pop up if error is thrown
                return false;
            })
            .then(function(){
                console.log("successfully authorized user");

                //sign in newly authorized user
                firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(){
                         console.log("successfully signed in new user");
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
                            }).catch(function(error){
                                 var errorcode = error.code;
                                 var errorMessage = error.message;
                                 console.log("Error: " + errorMessage);
                                 return false;
                            });
                         });
                         //numNP.once("value").then(function(snapshot){})


                })
                .catch(function(error){
                    console.log("Error: " + error.message);
                    return false;
                });
                return true;
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

        var registered = registerUser(email, password, birthday, zipcode, ssn, licenseNumber,firstName,lastName);

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
                  console.log("Error: " + errorMessage);
                });
            var data = {
                email: email,
                id: key,
                zipcode: zipcode
            };
            socket.emit('send email', data);

            console.log("All successful");
            $location.url('/');
        }else{
            console.log("failed");
        }

        $scope.user.email = '';
        $scope.user.password = '';
    };
}]);
