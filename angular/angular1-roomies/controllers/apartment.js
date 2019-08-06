var apartmentControllers = angular.module('apartmentControllers', []);

apartmentControllers.controller('ApartmentSettings', function ($scope, $rootScope, $state, FireBase) {
    $scope.auth = FireBase.authenticate();
    $scope.auth.$onAuth(function(authData) {
      $scope.currentUser = $scope.$parent.currentUser;
      $scope.currentUser.$loaded().then(function () {
        $scope.myApartment = FireBase.getObject('/apartments/' + $scope.currentUser.apartmentId);
      });
      $scope.saveApartment = function() {
        $scope.myApartment.$ref().set({
         address: {
            street: $scope.myApartment.address.street,
            city: $scope.myApartment.address.city,
            state: $scope.myApartment.address.state,
            zipcode: $scope.myApartment.address.zipcode
          }
        });
      };
    });
});

apartmentControllers.controller('NewApartment', function ($scope, $state, FireBase) {
  $scope.apartments = FireBase.getArray('/apartments');
  $scope.newApartment = function() {
    $scope.apartments.$add({
      address: {
        street: $scope.apartments.address.street,
        city: $scope.apartments.address.city,
        state: $scope.apartments.address.state,
        zipcode: $scope.apartments.address.zipcode
      }
    }).then(function(id){
      $scope.currentUser.$ref().set({
          apartmentId: id.path.o[1]
      });
    });
  };
});
