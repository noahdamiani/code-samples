$(document).foundation();

var fb = new Firebase('https://angular-roomies.firebaseio.com');

var app = angular.module('app', [
  'ngLoadingSpinner',
  'firebase',
  'apartmentControllers',
  'mapsControllers',
  'ui.router',
  'angularMoment'
]);

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'views/home.html',
    controller: 'HomeController'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'views/auth/login.html',
    controller: 'HomeController'
  })
  .state('apartment', {
    url: '/apartment',
    templateUrl: 'views/apartment/settings.html',
    controller: 'ApartmentSettings'
  })
  .state('newApartment', {
    url: '/new-apartment',
    templateUrl: 'views/apartment/new.html',
    controller: 'NewApartment'
  })
  .state('map', {
    url: '/map',
    templateUrl: 'views/map.html',
    controller: 'mapController'
  });
}]);

app.controller('HomeController', function ($scope, $state, FireBase) {
  $scope.siteName = 'Roomies';
  $scope.version = '1.0';
  $scope.currentUser = null;
  $scope.loggedIn = false;
  var Auth = FireBase.authenticate();
  $scope.auth = Auth;

  $scope.auth.$onAuth(function(authData) {
    $scope.currentUser = FireBase.getObject('/users/' + authData.uid);
    $scope.loggedIn = true;
  });

  $scope.createUser = function() {
    Auth.$unauth();
    $scope.message = null;
    $scope.error = null;
    $scope.users = FireBase.getArray('/users');
    var date = new Date();
    Auth.$createUser({
      email: $scope.email,
      password: $scope.password
    }).then(function(userData) {
      $scope.message = "User created with uid: " + userData.uid;
      $scope.users.$ref().child(userData.uid).set({
        name: $scope.name,
        rent: $scope.rent,
        email: $scope.email,
        createdAt: date.toString()
      });
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.removeUser = function() {
    $scope.message = null;
    $scope.error = null;

    Auth.$removeUser({
      email: $scope.email,
      password: $scope.password
    }).then(function() {
      $scope.message = "User removed";
    }).catch(function(error) {
      $scope.error = error;
    });
  };

  $scope.login = function() {
    Auth.$authWithPassword({
      email: $scope.user.email,
      password: $scope.user.password
    }).then(function(data) {
      this.email = null;
      this.password = null;
      $state.go('home');
    }).catch(function(error) {
      console.log(error);
    });
  };

  $scope.logout = function() {
    fb.unauth();
    window.localStorage.removeItem("firebase:session::angular-roomies");
    $state.go('login');
  }
});
