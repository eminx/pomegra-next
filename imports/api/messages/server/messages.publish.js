import { Meteor } from 'meteor/meteor';
import { MessagesCollection } from '../../collections';

Meteor.publish('chat', (requestId) => {
  const currentUserId = Meteor.userId();
  if (!currentUserId) {
    return null;
  }
  return MessagesCollection.find({
    requestId,
    $or: [{ borrowerId: currentUserId }, { lenderId: currentUserId }],
  });
});
