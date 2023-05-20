import { Meteor } from 'meteor/meteor';
import { RequestsCollection } from '../../collections';

Meteor.publish('request', function (requestId) {
  const userId = this.userId;
  if (userId) {
    return RequestsCollection.find({
      _id: requestId,
      $or: [
        {
          ownerId: userId,
        },
        {
          requesterId: userId,
        },
      ],
    });
  }
});