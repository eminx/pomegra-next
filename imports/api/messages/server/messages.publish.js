import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../../collections';

Meteor.publish('chat', function (requestId) {
  const currentUserId = this.userId;
  if (!currentUserId) {
    return null;
  }
  return MessagesCollection.find({
    requestId,
    $or: [{ borrowerId: currentUserId }, { lenderId: currentUserId }],
  });
});
