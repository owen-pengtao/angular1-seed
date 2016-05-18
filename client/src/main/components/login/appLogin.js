var baseURL = 'http://localhost:3001';
angular.module('ftl.login', [

])
  .factory("LoginService", ['$http', '$q', function ($http, $q) {
    var deferred = $q.defer();
    var loginService = {
      login : function (username, password) {
        var data = {
          'username' : username,
          'password' : password
        };
        $http.post(baseURL + '/login', data).success(function (res) {
          return deferred.resolve(res);
        });
        return deferred.promise;
      }
    };
    return loginService;
  }]);