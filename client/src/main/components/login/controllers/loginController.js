angular.module('ftl.login')
.controller("LoginController", ['$scope', 'LoginService', function ($scope, LoginService){
  $scope.login = {
    username: "",
    password: "",
    error: ""
  };
  $scope.login = function(){
    LoginService.login($scope.login.username, $scope.login.password).then(function(res){
      if (res.status === 1) {
        window.location.href = 'index.html';
      } else {
        $scope.login.error = "Incorrect username and password.";
      }
    });
    return false;
  };
}]);
