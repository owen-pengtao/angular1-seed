angular.module('ftl', [
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'pascalprecht.translate',
    'ngRoute',
    'ui.router',
    'ftl.landingPage'
])
.config(["$locationProvider", "$urlRouterProvider", "$stateProvider", function ($locationProvider, $urlRouterProvider, $stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'components/landingPage/views/landingPage.html',
        controller: 'LandingPageCtrl'
    });
    $urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode(true);
}])
.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/locales/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useSanitizeValueStrategy('sanitize');
}])
.run(["$rootScope", "$state", 'growl', function ($rootScope, $state, growl) {
    $rootScope.$state = $state;
    $rootScope.growl = growl;
    $rootScope.logout = function(){
      window.location.href = '/logout';
    };
}]);
