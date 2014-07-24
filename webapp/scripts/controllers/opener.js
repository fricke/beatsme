//OpenerCtrl

// If the user is logged it, it will see if there is a previous game and pass that
// to the template, otherwise start out the user.  Last, if the user isn't logged
// in it will show a login option. 
module.exports = ['$scope', '$window', '$http', function($scope, $window, $http) {
  if($window.user && $window.user.provider && $window.user.provider.beatsmusic) {

    //TODO: Can't get this route to work, no image is returning.
    //https://api.beatsmusic.com/api/users/200906592747520000/images/default?size=small

    //TODO: faking real image here, remove later.
    var userImg = ['https://api.beatsmusic.com/api/users/200906592747520000/images/default'];
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
