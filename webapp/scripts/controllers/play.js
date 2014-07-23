//PlayCtrl

module.exports = ['$scope', '$window', '$routeParams', function($scope, $window, $routeParams) {
  $scope.gameId = $routeParams.id;
}];
