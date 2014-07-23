var angular = require('angular');

var PlayCtrl = require('./controllers/play');
var OpenerCtrl = require('./controllers/opener');

var app = angular.module('beatsme', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/', {
        templateUrl: 'partials/opener.html',
        controller: 'OpenerCtrl'
      })
      .when('/play', {
        templateUrl: 'partials/play.html',
        controller: 'PlayCtrl'
      })
      .when('/play/:id', {
        templateUrl: 'partials/play.html',
        controller: 'PlayCtrl'
      })

    //$locationProvider.html5Mode(true);
  }]
);

app.run(['$rootScope', '$window', 'sessionService',
  function ($rootScope, $window, sessionService) {
    if ($window.user && Object.keys($window.user).length) {
      sessionService.authSuccess($window.user, $window.game, $window.players, $window.clientId);
      $rootScope.isLoggedIn = sessionService.isLoggedIn;
    }
  }
]);

app.controller('OpenerCtrl', OpenerCtrl);
app.controller('PlayCtrl', PlayCtrl);
