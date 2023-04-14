import { Meteor } from "meteor/meteor";

Meteor.publish("me", function () {
  const userId = this.userId;
  if (userId) {
    return Meteor.users.find(userId);
  }
});
