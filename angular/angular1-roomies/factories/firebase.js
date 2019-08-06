var app;

app.factory('FireBase', getFireBaseService);
function getFireBaseService($firebaseArray, $firebaseObject, $firebaseAuth) {
  return {
    getArray: function(url) {
      var ref = new Firebase("https://angular-roomies.firebaseio.com" + url);
      return $firebaseArray(ref);
    },
    getObject: function(url) {
      var ref = new Firebase("https://angular-roomies.firebaseio.com" + url);
      return $firebaseObject(ref);
    },
    authenticate: function() {
       var ref = new Firebase("https://angular-roomies.firebaseio.com");
       return $firebaseAuth(ref);
    },
    getLoggedInUser: function() {
      var user = localStorage.getItem('firebase:session::angular-roomies');
      if(user) {
        return JSON.parse(user);
      }
    }
  }
}
