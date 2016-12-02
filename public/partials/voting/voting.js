'use strict';


angular.module('tutorialWebApp.voting', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/voting/:race', {
    templateUrl: 'partials/voting/voting.html',
    controller: 'VotingCtrl'
  });
}])

.controller('VotingCtrl', ['$scope', '$location','$route','md5', '$firebaseAuth', function ($scope,$location,$route, md5, $firebaseAuth) {
    console.log("Voting Controller reporting for duty.");
    // closing nav bar on any page change
    $('.navbar-collapse').removeClass('in');

    $scope.url = $location.url().split('/')[2];
    $scope.foundKey = false;

    $scope.user = {

    }
    $scope.election = {

    }
    $scope.precincts = {

    }
    $scope.choice = {

    }
    $scope.showMessage = false;

    $scope.zipcodeAllowed = false;
    $scope.hasVoted = true;
    $scope.returnMessage = '';

    getData();

    $scope.vote = function(){
      var updates = {};
      updates['elections/' + $scope.url + '/hasVoted/' + $scope.user.voterID] = true;
      if($scope.choice.candidate == $scope.cand1.name){
        updates['elections/' + $scope.url + '/score1'] = $scope.election.score1 + 1;
        console.log("cand1");
      }else if($scope.choice.candidate === $scope.cand2.name){
        console.log("cand2");
        updates['elections/' + $scope.url + '/score2'] = $scope.election.score2 + 1;
      }
      firebase.database().ref().update(updates);

      var data = {
        id: $scope.user.voterID,
        selection: $scope.choice.candidate,
        election: $scope.election.Name

      };

      socket.emit('vote', data);
      $scope.showMessage = true;
      $scope.$apply();
    };


    $scope.findUser = function(){

        $scope.zipcodeAllowed = false;
        $scope.hasVoted = true;
        $scope.returnMessage = '';

        var voterID = $scope.user.voterID;
        console.log($scope.election.hasVoted);
        if($scope.election.hasVoted === null){
          $scope.hasVoted = false;
          $scope.$apply();
        }else if(!($scope.user.voterID in $scope.election.hasVoted)){
          $scope.hasVoted = false;
          $scope.$apply();
        }else{
          $scope.returnMessage = "You have already voted in this election.";
          $scope.$apply();
          return;
        }

          var ref = firebase.database().ref('voterIDs/');
          ref.once("value").then(function(snapshot){

            snapshot.forEach(function(id){

              if((id.key === voterID)){
                console.log('match found');
                $scope.zipcode = id.child('zipcode').val();
                console.log($scope.zipcode);
                console.log($scope.election.level);



                if($scope.election.level === 'National'){

                    $scope.zipcodeAllowed = true;
                    $scope.$apply();

                }else if($scope.election.level === 'State'){

                    console.log("in state " + $scope.election.state);

                    var stateRef = firebase.database().ref('states/' + $scope.election.state);
                    stateRef.once("value").then(function(states){
                      var zips = states.child('zipcodes').val();
                      console.log(zips);
                      var nums = zips.split('-');
                      console.log(nums);
                      var beginningZip = nums[0];
                      var endingZip = nums[1];
                      console.log(beginningZip);
                      console.log(endingZip);

                      if(($scope.zipcode >= beginningZip) && ($scope.zipcode <= endingZip)){
                        console.log("state zip okay");
                        $scope.zipcodeAllowed = true;
                        $scope.$apply();
                      }else{
                        $scope.returnMessage = "Voter ID not valid for this state.";
                        $scope.$apply();
                      }
                    })
                }else if($scope.election.level === 'Precinct'){


                  var precinctsRef = firebase.database().ref('precincts/' + $scope.election.precinct);
                  precinctsRef.once("value").then(function(precinct){

                      var precinctZip = precinct.child('zipcodes').val();
                      var beginningZip = precinctZip.split('-')[0];
                      var endingZip = precinctZip.split('-')[1];
                      console.log(precinctZip);
                      if(($scope.zipcode >= beginningZip) && ($scope.zipcode <= endingZip)){
                        console.log("in range precinct");
                        $scope.zipcodeAllowed = true;
                        $scope.$apply();

                        //$scope.race.precincts[precinct.key] = precinct.val();
                      }else{
                        $scope.returnMessage = "Voter ID not valid for this precinct.";
                        $scope.$apply();
                      }
                  });



                }
              }
            })
          })

    }


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
        $scope.election.state = snapshot.child('state').val();
        $scope.election.precinct = snapshot.child('precinct').val();
        if(snapshot.child('hasVoted').val() === 'voted'){
          $scope.election.hasVoted = null;
        }else{
          $scope.election.hasVoted = snapshot.child('hasVoted').val();
        }
        $scope.election.score1 = snapshot.child('score1').val();
        $scope.election.score2 = snapshot.child('score2').val();
        $scope.$apply();
        console.log($scope.election);

      }).then(function(){

        var hash1 = md5.createHash($scope.election.candidate1);
        var hash2 = md5.createHash($scope.election.candidate2);

        var ref = firebase.database().ref('Candidates');
        ref.once("value").then(function(snapshot){
          $scope.cand1 = snapshot.child(hash1).val();
          $scope.cand2 = snapshot.child(hash2).val();
          $scope.$apply();

        })
      })
    }
}]);
