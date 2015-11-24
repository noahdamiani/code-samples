Template.navLogin.created = function() {};

Template.navLogin.rendered = function() {
  return $('#application-nav-login').validate({
    rules: {
      emailAddress: {
        required: true,
        email: true
      },
      password: {
        required: true
      }
    },
    messages: {
      emailAddress: {
        required: "Please enter your email address to login.",
        email: "Please enter a valid email address."
      },
      password: {
        required: "Please enter your password to login."
      }
    },
    submitHandler: function() {
      var user;
      user = {
        email: $('[name="emailAddress"]').val(),
        password: $('[name="password"]').val()
      };
      return Meteor.loginWithPassword(user.email, user.password, function(error) {
        if (error) {
          $('.form-control').val("");
          return Router.go('loginError', {error: 'error'}, {query: 'msg='+error.reason});
        }
      });
    }
  });
};

Template.navLogin.helpers({
  example: function() {}
});

Template.navLogin.events({
  'submit form': function(e, t) {
    return e.preventDefault();
  }
});

Template.navigation.events({
  'mouseover .dropdown': function(e) {
    $(e.currentTarget).parent().find('a').eq(0).addClass('active');
  },
  'mouseleave .dropdown': function(e) {
    $(e.currentTarget).parent().find('a').eq(0).removeClass('active');
  }
});

Template.billboard.rendered = function() {
  $('section.search').hide().delay(1000).fadeIn('slow');
}
