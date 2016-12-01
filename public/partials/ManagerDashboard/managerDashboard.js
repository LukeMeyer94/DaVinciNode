'use strict';


angular.module('tutorialWebApp.managerDashboard', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/managerDashboard', {
    templateUrl: 'partials/ManagerDashboard/managerDashboard.html',
    controller: 'managerDashboardCtrl'
  });
}])

.controller('managerDashboardCtrl', ['$scope','md5', '$firebaseAuth','$route', function ($scope, md5, $firebaseAuth, $route) {
    console.log("Manager Dashboard Controller reporting for duty.");

    $scope.manager = {

    }

    $scope.precincts = {

    }

    $scope.elections = {

    }

    $scope.dates = {

    }

    $scope.now =  Date.now();

    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        $scope.manager.email = user.email;
        $scope.$apply();
        getData();
        //getElections();
      }
    });

    $scope.startElection = function(key){
      console.log(key);
      var updates = {};
      updates['elections/' + key + '/status'] = 'IP';
      updates['elections/' + key + '/score1'] = 0;
      updates['elections/' + key + '/score2'] = 0;
      var up = firebase.database().ref().update(updates);
      $route.reload();
    }

    $scope.endElection = function(key){
      console.log(key);
      $scope.winner = '';
      var ref = firebase.database().ref('elections/'+key);
      ref.once("value").then(function(snapshot){
        console.log(snapshot.child('score1').val());
        console.log(snapshot.child('score2').val());
        if(snapshot.child('score1').val() > snapshot.child('score2').val()){
          $scope.winner = snapshot.child('candidate1').val();
          $scope.$apply();
          console.log($scope.winner);
        }else if(snapshot.child('score1').val() < snapshot.child('score2').val()){
          $scope.winner = snapshot.child('candidate2').val();
          $scope.$apply();
          console.log($scope.winner);
        }else {
          $scope.winner = 'tie';
          $scope.$apply();
        }
      }).then(function(){
        var updates = {};
        updates['elections/' + key + '/status'] = 'closed';
        updates['elections/' + key + '/winner'] = $scope.winner;
        firebase.database().ref().update(updates).then(function(){
          $route.reload();
        });
      })


    }

    function getElections(){
      console.log($scope.manager.precinct);
      console.log($scope.manager.state);
      if($scope.manager.precinct != null){
        console.log("Precinct Manager");
        var ref = firebase.database().ref('elections/');
        ref.once("value").then(function(snapshot){
          snapshot.forEach(function(election){
            console.log(election.val());
            if(election.precinct != null){
              console.log("election precinct: " + election.precinct);
              var startDay = election.startDay;
              var endDay = election.endDay;
              var startMonth = election.startMonth;
              var endMonth = election.endMonth;
              var startYear = election.startYear;
              var endYear = election.endYear;
              var startDate = new Date(startYear, startMonth, startDay);
              console.log(startDate - $scope.now);
              var endDate = new Date(endYear, endMonth, endDay);
              $scope.dates[election.key] = {'startDate':startDate,'endDate':endDate};
              console.log($scope.dates);
              $scope.elections[election.key] = election;
              $scope.$apply();
            }
          });
        });
      }else if($scope.manager.state != null){
        var ref = firebase.database().ref('states/' + $scope.manager.state);
        ref.once("value").then(function(snapshot){
          var str = snapshot.child('zipcodes').val();
          var nums = str.split('-');
        //  console.log(nums);
          var beginningZip = nums[0];
          var endingZip = nums[1];
        //  console.log(beginningZip);
        //  console.log(endingZip);

          var precinctsRef = firebase.database().ref('precincts/');
          precinctsRef.once("value").then(function(snapshot){
            var precincts = {};

            snapshot.forEach(function(precinct){
            //  console.log(precinct.val());
              var precinctZip = precinct.child('zipcodes').val();
              precinctZip = precinctZip.split('-')[0];
          //    console.log(precinctZip);
              if((precinctZip >= beginningZip) && (precinctZip <= endingZip)){
          //      console.log("in range");
                precincts[precinct.key] = precinct.val();

                //$scope.race.precincts[precinct.key] = precinct.val();
              }
            })
            console.log(precincts);
            $scope.precincts = precincts;
            $scope.$apply();
          })
        }).then(function(){
          console.log("State Manager");
          var ref = firebase.database().ref('elections/');
          if($scope.precincts != null){
            console.log("precincts not null");
            ref.once("value").then(function(snapshot){
              snapshot.forEach(function(election){
                console.log(election.val());
                if(election.val().state != null){
                  console.log("election state: " +  election.val().state);
                  console.log(election.val().status);
                  var startDay = election.val().startDay;
                  console.log(startDay);
                  var endDay = election.val().endDay;
                  var startMonth = election.val().startMonth;
                  var endMonth = election.val().endMonth;
                  var startYear = election.val().startYear;
                  var endYear = election.val().endYear;
                  var startDate = new Date(startYear, startMonth, startDay);
                  var endDate = new Date(endYear, endMonth, endDay);
                  console.log(startDate);
                  console.log($scope.now);
                  console.log(startDate - $scope.now);
                  $scope.dates[election.key] = {'startDate':startDate,'endDate':endDate};
                  console.log($scope.dates);
                  $scope.elections[election.key] = election.val();
                  $scope.$apply();
                  console.log($scope.elections[election.key]);
                }else if(election.val().precinct != null){
                  console.log("a precinct race");
                  console.log($scope.precincts);
                  if(election.val().precinct in $scope.precincts){
                    console.log("election precinct: " + election.val().precinct);
                    var startDay = election.startDay;
                    var endDay = election.endDay;
                    var startMonth = election.startMonth;
                    var endMonth = election.endMonth;
                    var startYear = election.startYear;
                    var endYear = election.endYear;
                    var startDate = new Date(startYear, startMonth, startDay);
                    var endDate = new Date(endYear, endMonth, endDay);
                    console.log(startDate);
                    console.log($scope.now);
                    console.log(startDate - $scope.now);
                    $scope.dates[election.key] = {'startDate':startDate,'endDate':endDate};
                    console.log($scope.dates);

                    $scope.elections[election.key] = election.val();
                    console.log($scope.elections[election.key]);
                    $scope.$apply();
                  }
                }
              })
            })
          }else{
            console.log("couldn't get state's precincts");
          }
        })
      }
    }

    function getData(){
    //  var email = firebase.auth().currentUser;
      //console.log($scope.manager.email);
      var hash = md5.createHash($scope.manager.email);
      var ref = firebase.database().ref('managers/'  + hash);
      //console.log(hash);
      ref.once("value").then(function(snapshot){
        $scope.manager.birthday = snapshot.child('birthday').val();
        //console.log($scope.manager.birthday);
        $scope.manager.firstName = snapshot.child('firstName').val();
        //console.log($scope.manager.firstName);
        $scope.manager.lastName = snapshot.child('lastName').val();
        //console.log($scope.manager.lastName);
        $scope.manager.licenseNumber = snapshot.child('licenseNumber').val();
        //console.log($scope.manager.licenseNumber);
        $scope.manager.precinct = snapshot.child('precinct').val();
        $scope.manager.state = snapshot.child('state').val();
        //console.log($scope.manager.state);
        if($scope.manager.state != null){
          //getThisStatePrecincts($scope.manager.state);
        }
        //console.log($scope.manager.precinct);
        $scope.manager.ssn = snapshot.child('ssn').val();
        //console.log($scope.manager.ssn);
        $scope.manager.zipcode = snapshot.child('zipcode').val();
        //console.log($scope.manager.zipcode);


      }).then(function(){
        getElections();
      });
    }
}]);
