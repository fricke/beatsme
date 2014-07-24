// session.js
// Holds angular session data.  Sets up the user and game most importantly. 

var angular = require('angular');

angular.module('beatsme').factory('sessionService', ['$rootScope', '$window', '$http',
    function ($rootScope, $window, $http) {
      var session = {
          init: function () {
              this.reset();
          },
          reset: function() {
              this.user = null;
              this.isLoggedIn = false;
          },
          logout: function() {
              var scope = this;
              $http.get('/logout').success(function() {
                  scope.reset();
                  $rootScope.$emit('session-changed');
              });
          },
          authSuccess: function(user, game, players, clientId) {
              this.user = user;
              this.game = game;
              this.players = players;
              this.clientId = clientId;
              this.isLoggedIn = true;
              $rootScope.$emit('session-changed');
          }
      };
      session.init();
      return session;
}]);
