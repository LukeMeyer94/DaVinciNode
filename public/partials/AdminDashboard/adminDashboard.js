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
    
    $scope.item={
        
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
        var ref = firebase.database().ref('Precincts/');
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
    getPrecincts();
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