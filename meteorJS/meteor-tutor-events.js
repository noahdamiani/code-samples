Template.tutorSingle.events({
  'click .js-tab': function(event) {
  	event.preventDefault();
    // toggle showing the student/tutor registration
    $('.nav-tabs li').removeClass('active');
    $('.tab-pane').removeClass('active');
    $(event.currentTarget).addClass('active');
    var toggleData = $(event.currentTarget).find('a').attr('data-toggle');
    $('#'+toggleData).addClass('active');

  },
  'click a.messages': function(event) {
    event.preventDefault();
    var user = Meteor.user();
    var tutor = $('.tutor-listing [name="tutorId"]').val();
    var chat = {
      student_id: user._id,
      tutor_id: tutor,
      student_name: user.profile.firstName
    }
    var chatExists = Chats.findOne({"tutor_id": tutor, "student_id": user._id});
    if (chatExists) {
      var chatObject = {
        slug: $('.tutor-listing .messages').data('slug'),
        id: chatExists._id
      }
      Router.go('chat', chatObject);
    } else {
      return Meteor.call('createChat', chat, function(error, response) {
        if (error) {
          return alert(error.reason);
        } else {
          var chat = Chats.findOne({"tutor_id": tutor, "student_id": user._id});
          var chatObject = {
            slug: $('.tutor-listing .messages').data('slug'),
            id: chat._id
          }
          Router.go('chat', chatObject);
        }
      });
    }
  }
});
