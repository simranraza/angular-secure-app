myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope, $window, $location, UserAuthFactory, AuthenticationFactory) {


    $scope.login = function() {

      var username = $scope.user.username;
      var password = $scope.user.password;

      console.log('user anem:'+ username);

      if (username !== undefined && password !== undefined) {
        UserAuthFactory.login(username, password).success(function(data) {

          console.log('data.user.username:'+ data.user.username);
          console.log('data.user.role:'+ data.user.role);

          AuthenticationFactory.isLogged = true;
          AuthenticationFactory.user = data.user.username;
          AuthenticationFactory.userRole = data.user.role;

          $window.sessionStorage.token = data.token;
          $window.sessionStorage.user = data.user.username; // to fetch the user details on refresh
          $window.sessionStorage.userRole = data.user.role; // to fetch the user details on refresh

          $location.path("/");

        }).error(function(status) {
          alert('Oops something went wrong!');
        });
      } else {
        alert('Invalid credentials');
      }

    };

  }
]);
