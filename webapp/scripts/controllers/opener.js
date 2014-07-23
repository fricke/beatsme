//OpenerCtrl

module.exports = ['$scope', '$window', '$http', function($scope, $window, $http) {
  if($window.user && $window.user.provider && $window.user.provider.beatsmusic) {

    //TODO: Can't get this route to work, no image is returning.
    //https://api.beatsmusic.com/api/users/200906592747520000/images/default?size=small

    var userImg = ['https://api.beatsmusic.com/api/users/'];
    userImg.push($window.user.provider.beatsmusic.id);
    userImg.push('/images/default');
    userImg.push('?size=small');
    $scope.userImg = userImg.join('');


    if($window.game) {
      $scope.action = 'Resume';
      $scope.href = '#play/' + $window.game._id;
    } else {
      $scope.action = 'Play';
      $scope.href = '#play'
    }

  } else {
    $scope.action = 'Login';
    $scope.href = '/auth/beatsmusic';
    $scope.userImg = '../images/beatsmusic_logo.png';
    $scope.extraClass = 'no-border';
  }


}];
