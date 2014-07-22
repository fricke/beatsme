//OpenerCtrl

module.exports = ['$scope', '$window', '$http', function($scope, $window, $http) {
  if($window.user && $window.user.provider.beatsmusic) {

    //TODO: Can't get this route to work, no image is returning.
    //https://api.beatsmusic.com/api/users/200906592747520000/images/default?size=small

    var userImg = ['https://api.beatsmusic.com/api/users/'];
    userImg.push($window.user.provider.beatsmusic.id);
    userImg.push('/images/default');
    userImg.push('?size=small');
    $scope.userImg = userImg.join('');
    $scope.href = "#play";

  } else {
    handleOpenerClick = function(){};
    $scope.href = "/auth/beatsmusic"
  }


}];
