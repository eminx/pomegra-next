Meteor.publish('me', function() {
  const userId = Meteor.userId();
  if (userId) {
    return Meteor.users.find(userId);
  }
});
