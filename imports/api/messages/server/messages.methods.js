import { Meteor } from "meteor/meteor";
import { MessagesCollection } from "../../collections";

Meteor.methods({
  addMessage: (requestId, message) => {
    const currentUserId = Meteor.userId();
    const currentUser = Meteor.user();
    if (!currentUserId) {
      throw new Meteor.Error("You are not logged in");
    }
    const theMessage = MessagesCollection.findOne({
      requestId,
    });
    if (
      currentUserId !== theMessage.lenderId &&
      currentUserId !== theMessage.borrowerId
    ) {
      return;
    }
    try {
      const theMessage = MessagesCollection.findOne({ requestId });
      MessagesCollection.update(
        { requestId },
        {
          $push: {
            messages: {
              text: message,
              from: currentUserId,
              date: new Date(),
              senderName: currentUser.username,
            },
          },
          $set: {
            isSeenByOther: false,
            lastMessageBy: currentUserId,
          },
        }
      );

      const unSeenIndex = theMessage.messages.length;
      Meteor.call("createNotification", "request", requestId, unSeenIndex);
    } catch (error) {
      console.log("error", error);
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
    // Meteor.cAl('sendEmail', othersId, subjectEmail, textEmail);
    // }
  },
});
