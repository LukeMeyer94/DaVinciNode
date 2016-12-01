/**
 * Main AngularJS Web Application
 */
var app = angular.module('tutorialWebApp', [
  'ngRoute',
  'ui.bootstrap',
  'ui.mask',
  'angular-md5',
  'tutorialWebApp.signup',
  'tutorialWebApp.signin',
  'tutorialWebApp.voting',
  'tutorialWebApp.createAdmin',
  'tutorialWebApp.createManager',
  'tutorialWebApp.voterDashboard',
  'tutorialWebApp.managerDashboard',
  'tutorialWebApp.adminDashboard']
);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {

  $routeProvider
    .when("/",
        {   templateUrl: "partials/home/home.html",
            controller: "PageCtrl"
        })
    // else 404
    .otherwise("/404",
        {   templateUrl: "partials/404.html",
            controller: "PageCtrl"
        });
}]);

app.controller('PageCtrl', function($scope){
    console.log("Page Controller Reporting for duty");

    // closing nav bar on any page change
    $('.navbar-collapse').removeClass('in');
})
