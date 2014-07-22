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
      });

    //$locationProvider.html5Mode(true);
  }]
);

app.run(['$rootScope', '$window', 'sessionService',
  function ($rootScope, $window, sessionService) {
    $rootScope.session = sessionService;
    $window.app = {
      authState: function(state, user) {
        $rootScope.$apply(function() {
          switch (state) {
            case 'success':
                sessionService.authSuccess(user);
                break;
            case 'failure':
                sessionService.authFailed();
                break;
          }
        });
      }
    };

    if ($window.user !== null) {
      sessionService.authSuccess($window.user, $window.game, $window.players, $window.clientId);
    }
  }
]);

app.controller('OpenerCtrl', OpenerCtrl);
app.controller('PlayCtrl', PlayCtrl);
