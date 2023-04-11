import { Meteor } from "meteor/meteor";
import {
  BooksCollection,
  MessagesCollection,
  RequestsCollection,
} from "../../collections";

Meteor.methods({
  getRequests: () => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      return;
    }

    try {
      return RequestsCollection.find({
        $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
      }).fetch();
    } catch (error) {
      return error;
    }
  },

  getSingleRequest: (requestId) => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      return false;
    }

    try {
      return RequestsCollection.findOne({
        _id: requestId,
        $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
      });
    } catch (error) {
      return error;
    }
  },

  makeRequest: (bookId) => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      return false;
    }

    try {
      const theBook = BooksCollection.findOne(bookId);
      const currentUser = Meteor.user();
      const owner = Meteor.users.findOne(theBook.ownerId);

      if (
        RequestsCollection.findOne({
          bookId: bookId,
          requesterId: currentUserId,
        })
      ) {
        throw new Meteor.Error("You have already requested this item");
      }
      const requestId = RequestsCollection.insert({
        bookId: bookId,
        requesterId: currentUserId,
        ownerId: theBook.ownerId,
        ownerUsername: theBook.ownerUsername,
        requesterUsername: currentUser.username,
        ownerAvatar: theBook.ownerAvatar,
        requesterAvatar: currentUser.avatar,
        bookTitle: theBook.title,
        bookAuthors: theBook.authors,
        bookImage: theBook.imageUrl,
        bookLanguage: theBook.language,
        bookCategories: theBook.categories,
        dateRequested: new Date(),
      });

      MessagesCollection.insert({
        requestId: requestId,
        borrowerId: currentUserId,
        lenderId: theBook.ownerId,
        isSeenByOther: false,
        messages: new Array(),
      });

      BooksCollection.update(bookId, {
        $set: {
          onRequest: true,
          isAvailable: false,
        },
      });

      return requestId;

      // const subjectEmail = 'Someone is interested in reading your book';
      // var textEmail =
      //   'Hi ' +
      //   ownerUsername +
      //   '. ' +
      //   requesterName +
      //   ' has requested to borrow a book from you. Please go ahead and reply at: https://app.pomegra.org/my-requests/';
      // Meteor.call('sendEmail', ownerId, subjectEmail, textEmail);
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  acceptRequest: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error("You are not logged in!");
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error("You are not the owner!");
    }

    try {
      RequestsCollection.update(
        { _id: requestId },
        {
          $set: {
            isConfirmed: new Date(),
            isRepliedAndNotSeen: true,
          },
        }
      );

      BooksCollection.update(
        { _id: bookId },
        {
          $set: {
            onRequest: false,
            onAcceptance: true,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }

    return;

    const subjectEmail = "Your request has been accepted!";
    const textEmail = `Congratulations! One of your requests has been accepted. Check at: https://app.pomegra.org/request/${requestId}`;
    Meteor.call("sendEmail", borrowerId, subjectEmail, textEmail);
  },

  denyRequest: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error("You are not logged in");
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error("You are not the owner!");
    }

    RequestsCollection.update(
      { _id: requestId },
      {
        $set: {
          isDenied: new Date(),
        },
      }
    );

    BooksCollection.update(
      { _id: request.bookId },
      {
        $set: {
          onRequest: false,
          isAvailable: true,
        },
      }
    );
  },

  isHanded: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error("You are not logged in");
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error("You are not the owner!");
    }

    RequestsCollection.update(
      { _id: requestId },
      {
        $set: {
          isHanded: new Date(),
        },
      }
    );

    BooksCollection.update(
      { _id: request.bookId },
      {
        $set: {
          onAcceptance: false,
          onLend: true,
        },
      }
    );
  },

  isReturned: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error("You are not logged in");
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error("You are not the owner!");
    }

    RequestsCollection.update(
      { _id: requestId },
      {
        $set: {
          isReturned: new Date(),
        },
      }
    );

    BooksCollection.update(
      { _id: request.bookId },
      {
        $set: {
          onLend: false,
          returned: true,
          isAvailable: true,
        },
        $inc: {
          xTimes: 1,
        },
      }
    );
  },

  abortRequest: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error("You are not logged in");
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error("You are not the owner!");
    }

    RequestsCollection.update(
      { _id: requestId },
      {
        $set: {
          isAborted: true,
        },
      }
    );

    BooksCollection.update(
      { _id: request.bookId },
      {
        $set: {
          isAvailable: true,
        },
      }
    );
  },
});
