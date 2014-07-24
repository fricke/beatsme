//PlayCtrl

// Simplys passes on the gameId to the angular template
module.exports = ['$rootScope', '$scope', '$window', '$routeParams', function($rootScope, $scope, $window, $routeParams) {
  $rootScope.gameId = $routeParams.id;
}];
