var signin = angular.module('tutorialWebApp.signin', []);

signin.controller('SignInCtrl', ['$scope','md5', '$firebaseAuth','$route','$location', '$rootScope', '$window',
    function ($scope,md5, $firebaseAuth, $route, $location, $rootScope, $window) {
    console.log("SignIn Controller reporting for duty.");
    $scope.isAdmin = false;
    $scope.isManager= false;
    $scope.isVoter = true;
    
    if(firebase.auth().currentUser == null){
        $scope.userSignedIn = false;
    } else{
        $scope.userSignedIn = true;
        var hash = md5.createHash(firebase.auth().currentUser.email);
        console.log(firebase.auth().currentUser.email);
        var ref = firebase.database().ref('admins/' + hash);
        ref.once("value").then(function(snapshot){
            if(snapshot.hasChild('email')){
                $scope.isAdmin = true;
            }
        });
    }

    firebase.auth().onAuthStateChanged(function(user){
        if(firebase.auth().currentUser){
            $scope.userSignedIn = true;
            console.log("user signed in: " + firebase.auth().currentUser);
            console.log($scope.userSignedIn);
            var hash = md5.createHash(firebase.auth().currentUser.email);
            console.log(firebase.auth().currentUser.email);
            var ref = firebase.database().ref();
            ref.once("value").then(function(snapshot){
                var admin = snapshot.child('admins/' + hash).val();
                if(admin !=null){
                    $scope.isAdmin = true;
                    $scope.isVoter = false;
                    console.log("isAdmin");
                    $window.location.href = '#/adminDashboard';
                }else{
                    var manager = snapshot.child('managers/' + hash).val();
                    if(manager != null){
                        $scope.isManager = true;
                        $scope.isVoter = false;
                        console.log("isManager");
                        $window.location.href = '#/managerDashboard';
                    }else{
                        $window.location.href = '#/voterDashboard';
                    }
                }
            });
            $scope.$apply();
        }else{
            $scope.userSignedIn = false;
            console.log(firebase.auth().currentUser);
            $scope.isAdmin = false;
            $scope.$apply();
        }
    });

    $scope.goToProfile = function(){
        if(firebase.auth().currentUser != null){
            var email = firebase.auth().currentUser.email;
            console.log(email);

            var hash = md5.createHash(email);


            var ref = firebase.database().ref('voters/' + hash);
            ref.once("value")
                .then(function(snapshot){
                    if(snapshot.exists()){
                        console.log("would go to profile here if that page existed.");
                    }
                });
        }
    }

    $scope.signOut = function(){
        firebase.auth().signOut();
        console.log("Signout button clicked");
        $window.location.href = '#/';
        $scope.$apply();
    };

    $scope.signIn = function(){
       console.log("login button clicked");

       $scope.user.invalidEmail = false;
       $scope.user.userDoesNotExist = false;
       $scope.user.incorrectPassword = false;

        if (firebase.auth().currentUser) {
            console.log(firebase.auth().currentUser.email);
            firebase.auth().signOut();
            console.log(firebase.auth().currentUser.email);
            console.log("have to sign out first.");
        } else{
            var email = $scope.user.email;
            var password = $scope.user.password;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(function(){
                    var hash = md5.createHash(email);
                    var ref = firebase.database().ref();
                    ref.once("value").then(function(snapshot){
                        var admin = snapshot.child('admins/' + hash).val();
                        if(admin !=null){
                            $scope.isAdmin = true;
                            $scope.isVoter = false;
                            console.log("isAdmin");
                            $window.location.href = '#/adminDashboard';
                        }else{
                            var manager = snapshot.child('managers/' + hash).val();
                            if(manager != null){
                                $scope.isManager = true;
                                $scope.isVoter = false;
                                console.log("isManager");
                                $window.location.href = '#/managerDashboard';
                            }else{
                                $window.location.href = '#/voterDashboard';
                            }
                        }
                    })
                })
                .catch(function(error){
                   console.log(error.code);
                   var errorCode = error.code;

                   if(errorCode === 'auth/invalid-email'){
                        $scope.user.invalidEmail = true;
                   }
                   if(errorCode === 'auth/user-not-found' || errorCode === 'auth/user-disabled'){
                       $scope.user.userDoesNotExist = true;
                   }
                   if(errorCode === 'auth/wrong-password'){
                       $scope.user.incorrectPassword = true;
                   }else{
                       console.log("random error?");
                   }


                });

            //console.log(firebase.auth().currentUser.email);
            if(!$scope.regForm.$invalid){
                $scope.user.email= '';
                $scope.user.password = '';
                $('#myModal').modal('hide');
            }else{
                $scope.user.email= '';
                $scope.user.password = '';
            }
            
            
        }
        //$scope.$apply();
        $route.reload();
    };
}]);
