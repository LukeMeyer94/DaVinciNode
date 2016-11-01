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
    
        var email = $scope.user.email;
    var email2= $scope.user.email2;
    
    var password = $scope.user.password;
    var passwrod2= $scope.user.password2;
    
    function registerUser(email, password){
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
                            var hash = md5.createHash(email);
                            firebase.database().ref('admins/' + hash).set({
                                email: email
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
        
        var registered = registerUser(email, password);
        
        if(registered){
            console.log("All successful");
            $location.url('/');
        }else{
            console.log("failed");
        }
        
        $scope.user.email = '';
        $scope.user.email2 = '';
        $scope.user.password = '';
        $scope.user.password2 = '';
    };
}]);
