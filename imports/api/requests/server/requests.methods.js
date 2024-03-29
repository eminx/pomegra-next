import { Meteor } from 'meteor/meteor';

import BooksCollection from '../../books/book';
import RequestsCollection from '../request';

Meteor.methods({
  getMyRequests: () => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      throw new Meteor.Error('Please login');
    }
    try {
      return RequestsCollection.find({
        $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
      }).fetch();
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  getSingleRequest: (requestId) => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      throw new Meteor.Error('Please login');
    }
    try {
      return RequestsCollection.findOne({
        _id: requestId,
        $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  makeRequest: (bookId) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      return false;
    }

    try {
      const theBook = BooksCollection.findOne(bookId);
      const owner = Meteor.users.findOne(theBook.ownerId);

      if (
        RequestsCollection.findOne({
          bookId: bookId,
          requesterId: currentUser._id,
        })
      ) {
        throw new Meteor.Error('You have already requested this item');
      }
      const requestId = RequestsCollection.insert({
        bookAuthors: theBook.authors,
        bookCategories: theBook.categories,
        bookImage: theBook.imageUrl,
        bookId,
        bookLanguage: theBook.language,
        bookTitle: theBook.title,
        dateRequested: new Date(),
        isSeenByOther: false,
        lastMessageDate: new Date(),
        messages: new Array(),
        ownerImage: owner?.images && owner.images[0],
        ownerId: theBook.ownerId,
        ownerUsername: theBook.ownerUsername,
        requesterId: currentUser._id,
        requesterImage: currentUser.images && currentUser.images[0],
        requesterUsername: currentUser.username,
      });

      BooksCollection.update(bookId, {
        $set: {
          isAvailable: false,
          onRequest: true,
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
      console.log(error);
      throw new Meteor.Error(error);
    }
  },

  acceptRequest: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in!');
    }

    const request = RequestsCollection.findOne(requestId);
    if (!request || request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
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
        { _id: request.bookId },
        {
          $set: {
            onRequest: false,
            onAcceptance: true,
          },
        }
      );
    } catch (error) {
      console.log(error);
      throw new Meteor.Error(error);
    }

    return;

    const subjectEmail = 'Your request has been accepted!';
    const textEmail = `Congratulations! One of your requests has been accepted. Check at: https://app.pomegra.org/request/${requestId}`;
    Meteor.call('sendEmail', borrowerId, subjectEmail, textEmail);
  },

  denyRequest: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
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

  setIsHanded: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
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

  setIsReturned: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
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
      throw new Meteor.Error('You are not logged in');
    }

    const request = RequestsCollection.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
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

  addMessage: (requestId, message) => {
    const currentUser = Meteor.user();
    const currentUserId = currentUser._id;
    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }
    const theMessage = RequestsCollection.findOne({
      _id: requestId,
    });
    if (
      currentUserId !== theMessage.ownerId &&
      currentUserId !== theMessage.requesterId
    ) {
      return;
    }

    const unSeenIndex = RequestsCollection.findOne({ _id: requestId })?.messages
      ?.length;

    try {
      RequestsCollection.update(
        {
          _id: requestId,
        },
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
            lastMessageDate: new Date(),
          },
        }
      );

      Meteor.call('createNotification', 'request', requestId, unSeenIndex);
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  reportContent: (contentId, context) => {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    if (context === 'request') {
      RequestsCollection.update(contentId, {
        $set: {
          isReported: true,
        },
      });
    } else if (context === 'book') {
      BooksCollection.update(contentId, {
        $set: {
          isReported: true,
        },
      });
    } else if (context === 'user') {
      Meteor.users.update(
        { username: contentId },
        {
          $set: {
            isReported: true,
          },
        }
      );
    }
  },
});
