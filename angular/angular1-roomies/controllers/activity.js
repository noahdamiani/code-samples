app.controller('ActivityController', function($scope) {
    $scope.activities = [
      {
        name: 'Noah Damiani',
        desc: 'Paid Rent',
        time: new Date()
      }, 
      {
        name: 'Gabby Namm',
        desc: 'Paid Patrick Wilson',
        time: new Date()
      }, 
      {
        name: 'Romaine Gest',
        desc: 'Posted a new note',
        time: new Date()
      } 
    ];
});
