//OpenerCtrl

module.exports = ['$scope', '$window', function($scope, $window) {
  if($window.user && $window.user.provider.beatsmusic) {
    //https://api.beatsmusic.com/api/users/200906592747520000/images/default?size=small

    var userImg = ['https://api.beatsmusic.com/api/users/'];
    userImg.push($window.user.provider.beatsmusic.id);
    userImg.push('/images/default');
    userImg.push('?size=small');
    $scope.userImg = userImg.join('');
    $scope.href = "/game";
  } else {
    $scope.href = "/auth/beatsmusic"
  }
}];
