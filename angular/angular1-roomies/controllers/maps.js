var mapsControllers = angular.module('mapsControllers', ['uiGmapgoogle-maps']);

mapsControllers.config(
    ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
        GoogleMapApiProviders.configure({
            china: true
        }); 
    }]
);

mapsControllers.controller('mapController', function ($scope, $state, $http, FireBase) {
  $scope.auth = FireBase.authenticate();
  $scope.auth.$onAuth(function(authData) {
    $scope.currentUser.$loaded().then(function () {
      $scope.myApartment = FireBase.getObject('/apartments/' + $scope.currentUser.apartmentId);
      $scope.myApartment.$loaded().then(function(){
        var address = $scope.myApartment.address;
        var street = address.street.split(' ').join('+');
        var city = address.city;
        var state = 'NY';
        var mapURL = 'http://maps.google.com/maps/api/geocode/json?address=' + street + ',' + city + ',+' + state + '&sensor=false';

        $http.get(mapURL).success(function(mapData) {
          $scope.results = mapData.results[0].geometry.location;
          angular.extend($scope, {
              map: {
                  center: {
                      latitude: $scope.results.lat,
                      longitude: $scope.results.lng
                  },
                  zoom: 18,
                  markers: [{
                      id: new Date(),
                      coords: {
                          latitude: $scope.results.lat,
                          longitude: $scope.results.lng
                      }
                  }]
              }
          });
        });
      });
    });
  });
});
