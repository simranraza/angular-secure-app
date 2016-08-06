var myApp = angular.module('identityClient', ['ngRoute','ngMockE2E']);

//add Token Interceptor to httpProvider
myApp.config(function($routeProvider, $httpProvider) {

  $routeProvider
  .when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl',
    access: {
      requiredLogin: false
    }
  })
  .when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl',
    access: {
      requiredLogin: false
    }
  }).when('/page1', {
    templateUrl: 'partials/page1.html',
    controller: 'Page1Ctrl',
    access: {
      requiredLogin: true
    }
  })
  .otherwise({
    redirectTo: '/login'
  });
});

myApp.run(function($rootScope, $window, $location, AuthenticationFactory, $httpBackend){

  console.log('app run');
  // when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();

  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    console.log('templateUrl of next route: ' + nextRoute.templateUrl);
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    console.log('route is' + $location.path());
    // if the user is already logged in, take him to the home page
      //if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      //  $location.path('/');
      //}
  });



  $httpBackend.whenPOST('http://localhost:3000/login').respond(function(method, url, data, headers){
    console.log('Received these data:', method, url, data, headers);
    var username = data.username || '';
    var password = data.password || '';

    var user = {name: 'user 1',id: '1'};
    return [200, {token: "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1Nzg0OGM4Y2ExNDRmMWI4NmE0ODE2NDgiLCJuYW1lIjoic2ltb24iLCJwYXNzd29yZCI6IiQyYSQxMCR4SzRaVk9tNkp3dVRMb1RYREhWREguUmJ6VlJlLmxiWHlRd3JYeFVDYzdXalQ1THROenNwNiIsIl9fdiI6MH0.DCuUAo2291GWOG7SE6Nn093ZFjUNZX6UVZu0PxWL-rg",expires: 1,
    user: user}, {}];
  });
  // Passthrough everything
    $httpBackend.whenGET(/[\s\S]*/).passThrough();

});
