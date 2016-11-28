'use strict';


angular.module('tutorialWebApp.adminDashboard', ['ngRoute','firebase', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/adminDashboard', {
    templateUrl: 'partials/AdminDashboard/adminDashboard.html',
    controller: 'adminDashboardCtrl'
  });
}])

.controller('adminDashboardCtrl', ['$scope', 'md5', '$firebaseAuth', function ($scope,md5, $firebaseAuth) {
    console.log("Admin Dashboard Controller reporting for duty.");

    $scope.showElectionForm = false;
    $scope.showCreateCandidate = false;

    $scope.newCandidate = {

    }

    $scope.election = {

    }

    $scope.precincts = {

    }

    $scope.states = {

    }

    $scope.state = {

    }

    $scope.item={

    }

    $scope.level = {

    }

    $scope.race = {

    }

    $scope.races = {

    }

    $scope.typeChosen = false;

    $scope.chooseDifferentType = function(){
      $scope.typeChosen = false;
      $scope.race = {};
      $scope.$apply();
    }

    $scope.getThisStatePrecincts = function(state){
      console.log(state);
      var ref = firebase.database().ref('states/' + state);
      ref.once("value").then(function(snapshot){
        var str = snapshot.val();
        console.log(str);
        var nums = str.split('-');
        console.log(nums);
        var beginningZip = nums[0];
        var endingZip = nums[1];
        console.log(beginningZip);
        console.log(endingZip);

        var precinctsRef = firebase.database().ref('precincts/');
        precinctsRef.once("value").then(function(snapshot){
          var precincts = {};

          snapshot.forEach(function(precinct){
            console.log(precinct.val());
            var precinctZip = precinct.child('zipcodes').val();
            precinctZip = precinctZip.split('-')[0];
            console.log(precinctZip);
            if((precinctZip >= beginningZip) && (precinctZip <= endingZip)){
              console.log("in range");
              precincts[precinct.key] = precinct.val();

              //$scope.race.precincts[precinct.key] = precinct.val();
            }
          })

          console.log(precincts);
          $scope.race.precincts = precincts;
          $scope.$apply();
          console.log($scope.race.precincts);
        });
      });
    }

    $scope.test = function(){
        console.log($scope.item.precincts);
    }

    $scope.createCandidate = function(){
        var name = $scope.newCandidate.Name;
        var party = $scope.newCandidate.party;
        var hash = md5.createHash(name);

        var ref = firebase.database().ref('Candidates/' + hash);
        ref.once("value").then(function(snapshot){
           if(snapshot.val() === null){
               ref.set({
                   name: name,
                   party: party
               });


           }
        });

        $scope.newCandidate.name = '';
               $scope.newCandidate.party = '';
               $scope.showCreateCandidate = false;
    }

    $scope.createElection = function(){
      if($scope.race.level === 'National'){
        var newKey = firebase.database().ref().child('elections/').push().key;

        var candidate1 = md5.createHash($scope.candidate1);
        console.log(candidate1);
        var candidate2 = md5.createHash($scope.candidate2);
        console.log(candidate2);

        var ref = firebase.database().ref('elections/' + newKey).set({
          electionName: $scope.election.Name,
          description: $scope.election.Description,
          startDate: $scope.dt,
          endDate: $scope.dtEnd,
          candidate1: $scope.candidate1,
          candidate2: $scope.candidate2,
          raceLevel: $scope.race.level,
          raceName: $scope.race.name

        }).catch(function(error){
             var errorcode = error.code;
             var errorMessage = error.message;
             console.log("Error: " + errorMessage);

        });
        console.log('national');
      }else if($scope.race.level === 'State'){
        var newKey = firebase.database().ref().child('elections/').push().key;

        var candidate1 = md5.createHash($scope.candidate1);
        console.log(candidate1);
        var candidate2 = md5.createHash($scope.candidate2);
        console.log(candidate2);

        var ref = firebase.database().ref('elections/' + newKey).set({
          electionName: $scope.election.Name,
          description: $scope.election.Description,
          startDate: $scope.dt,
          endDate: $scope.dtEnd,
          candidate1: $scope.candidate1,
          candidate2: $scope.candidate2,
          raceLevel: $scope.race.level,
          raceName: $scope.race.name,
          state: $scope.race.state

        }).catch(function(error){
             var errorcode = error.code;
             var errorMessage = error.message;
             console.log("Error: " + errorMessage);

        });
        console.log('state');
      }else if($scope.race.level === 'Precinct'){
        var newKey = firebase.database().ref().child('elections/').push().key;

        var candidate1 = md5.createHash($scope.candidate1);
        console.log(candidate1);
        var candidate2 = md5.createHash($scope.candidate2);
        console.log(candidate2);

        var ref = firebase.database().ref('elections/' + newKey).set({
          electionName: $scope.election.Name,
          description: $scope.election.Description,
          startDate: $scope.dt,
          endDate: $scope.dtEnd,
          candidate1: $scope.candidate1,
          candidate2: $scope.candidate2,
          raceLevel: $scope.race.level,
          raceName: $scope.race.name,
          precinct: $scope.race.precinct

        }).catch(function(error){
             var errorcode = error.code;
             var errorMessage = error.message;
             console.log("Error: " + errorMessage);

        });
        console.log('precinct');
      }

      $scope.showElectionForm = false;
    }


    function getCandidates(){
        var ref = firebase.database().ref('Candidates/');
        ref.once("value").then(function(snapshot){
           $scope.candidates = snapshot.val();
            console.log($scope.candidates);
        });
    }
    getCandidates();
    $scope.candidate1 = null;
    $scope.candidate2 = null;


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
        });
    }

    function getStates(){
      var ref = firebase.database().ref('states/');
      ref.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          var key = childSnapshot.key;
          var data = childSnapshot.val();
          console.log(key);
          console.log(data);
          $scope.states[key]=data;
        })
      })
    }

    function getRaces(){
      var ref=firebase.database().ref('races/');
      ref.once("value").then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
          var level = childSnapshot.key;
          var racesForLevel = childSnapshot.val();
          $scope.races[level] = racesForLevel;
        })
      })
    }
    getPrecincts();
    getStates();
    getRaces();



    $scope.today = function() {
    $scope.dt = new Date();
    $scope.dtEnd = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
    $scope.dtEnd = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    //dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

}]);
