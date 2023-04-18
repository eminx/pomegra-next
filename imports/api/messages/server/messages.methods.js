import { Meteor } from 'meteor/meteor';
import { MessagesCollection, RequestsCollection } from '../../collections';

Meteor.methods({
  getRequestMessages: (requestId) => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      throw new Meteor.Error('Please login');
    }
    try {
      MessagesCollection.find({
        requestId,
        $or: [{ borrowerId: currentUserId }, { lenderId: currentUserId }],
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  addMessage: (requestId, message) => {
    const currentUser = Meteor.user();
    const currentUserId = currentUser._id;
    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }
    const theMessage = MessagesCollection.findOne({
      requestId,
    });
    if (currentUserId !== theMessage.lenderId && currentUserId !== theMessage.borrowerId) {
      return;
    }

    const unSeenIndex = MessagesCollection.findOne({ requestId })?.messages?.length;

    try {
      MessagesCollection.update(
        { requestId },
        {
          $push: {
            messages: {
              content: message,
              senderUsername: currentUser.username,
              senderId: currentUserId,
              createdDate: new Date(),
            },
          },
          $set: {
            isNotificationOn: true,
            isSeenByOther: false,
            lastMessageBy: currentUserId,
          },
        }
      );

      Meteor.call('createNotification', 'request', theMessage.requestId, unSeenIndex);
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }

    // let othersId;
    // const theRequest = RequestsCollection.findOne(requestId);
    // if (theRequest.ownerUsername === currentUser.username) {
    //   othersId = theRequest.requesterId;
    // } else {
    //   othersId = theRequest.ownerId;
    // }

    // if (
    //   MessagesCollection.findOne({
    //     isSeenByOther: false,
    //     requestId: requestId
    //   })
    // ) {
    // const myName = Meteor.user().username;
    // const subjectEmail = 'You have a new message!';
    // const teREmail = `You received a new message from ${myName}. You can see and reply here: https://app.pomegra.org/request/${requestId}`;
    // Meteor.call('sendEmail', othersId, subjectEmail, textEmail);
    // }
  },
});
