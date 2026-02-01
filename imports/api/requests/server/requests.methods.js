import { Meteor } from 'meteor/meteor';

import BooksCollection from '../../books/book';
import RequestsCollection from '../request';

Meteor.methods({
  getMyRequests: async () => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;

    try {
      return await RequestsCollection.find({
        $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
      }).fetchAsync();
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  getSingleRequest: async (requestId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;

    try {
      return await RequestsCollection.findOneAsync({
        _id: requestId,
        $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
      });
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  makeRequest: async (bookId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;

    try {
      const theBook = await BooksCollection.findOneAsync(bookId);
      const owner = await Meteor.users.findOneAsync(theBook.ownerId);

      if (
        await RequestsCollection.findOneAsync({
          bookId: bookId,
          requesterId: currentUserId,
        })
      ) {
        throw new Meteor.Error('You have already requested this item');
      }
      const requestId = await RequestsCollection.insertAsync({
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

      await BooksCollection.updateAsync(bookId, {
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
      throw new Meteor.Error(error);
    }
  },

  acceptRequest: async (requestId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;

    const request = await RequestsCollection.findOneAsync(requestId);
    if (!request || request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      await RequestsCollection.updateAsync(
        { _id: requestId },
        {
          $set: {
            isConfirmed: new Date(),
            isRepliedAndNotSeen: true,
          },
        }
      );

      await BooksCollection.updateAsync(
        { _id: request.bookId },
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

    const subjectEmail = 'Your request has been accepted!';
    const textEmail = `Congratulations! One of your requests has been accepted. Check at: https://app.pomegra.org/request/${requestId}`;
    await Meteor.callAsync('sendEmail', borrowerId, subjectEmail, textEmail);
  },

  denyRequest: async (requestId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;
    const request = await RequestsCollection.findOneAsync(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      await RequestsCollection.updateAsync(
        { _id: requestId },
        {
          $set: {
            isDenied: new Date(),
          },
        }
      );

      await BooksCollection.updateAsync(
        { _id: request.bookId },
        {
          $set: {
            onRequest: false,
            isAvailable: true,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  setIsHanded: async (requestId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;
    const request = await RequestsCollection.findOneAsync(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      await RequestsCollection.updateAsync(
        { _id: requestId },
        {
          $set: {
            isHanded: new Date(),
          },
        }
      );

      await BooksCollection.updateAsync(
        { _id: request.bookId },
        {
          $set: {
            onAcceptance: false,
            onLend: true,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  setIsReturned: async (requestId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;

    const request = await RequestsCollection.findOneAsync(requestId);
    if (!request || request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      await RequestsCollection.updateAsync(
        { _id: requestId },
        {
          $set: {
            isReturned: new Date(),
          },
        }
      );

      await BooksCollection.updateAsync(
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
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  abortRequest: async (requestId) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;
    const request = await RequestsCollection.findOneAsync(requestId);
    if (!request || request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      await RequestsCollection.updateAsync(
        { _id: requestId },
        {
          $set: {
            isAborted: true,
          },
        }
      );

      await BooksCollection.updateAsync(
        { _id: request.bookId },
        {
          $set: {
            isAvailable: true,
          },
        }
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  addMessage: async (requestId, message) => {
    const currentUser = await Meteor.userAsync();
    if (!currentUser) {
      throw new Meteor.Error('Please login');
    }
    const currentUserId = currentUser._id;
    const theMessage = await RequestsCollection.findOneAsync({
      _id: requestId,
    });
    if (
      currentUserId !== theMessage.ownerId &&
      currentUserId !== theMessage.requesterId
    ) {
      return;
    }
    const theRequest = await RequestsCollection.findOneAsync({
      _id: requestId,
    });
    const unSeenIndex = theRequest?.messages?.length;

    try {
      await RequestsCollection.updateAsync(
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

      await Meteor.callAsync(
        'createNotification',
        'request',
        requestId,
        unSeenIndex
      );
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },

  reportContent: async (contentId, context) => {
    const user = await Meteor.userAsync();
    if (!user) {
      throw new Meteor.Error('Please login');
    }

    try {
      if (context === 'request') {
        await RequestsCollection.updateAsync(contentId, {
          $set: {
            isReported: true,
          },
        });
      } else if (context === 'book') {
        await BooksCollection.updateAsync(contentId, {
          $set: {
            isReported: true,
          },
        });
      } else if (context === 'user') {
        await Meteor.users.updateAsync(
          { username: contentId },
          {
            $set: {
              isReported: true,
            },
          }
        );
      }
    } catch (error) {
      throw new Meteor.Error(error);
    }
  },
});
