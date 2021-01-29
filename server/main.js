import { Meteor } from 'meteor/meteor';
import { Books, Requests, Messages } from '/imports/api/collections';
import { Accounts } from 'meteor/accounts-base';
const s3Settings = Meteor.settings.AWSs3;

Slingshot.fileRestrictions('profileImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective('profileImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function () {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function (file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  },
});

Slingshot.fileRestrictions('coverUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective('coverUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function () {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function (file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  },
});

Slingshot.fileRestrictions('bookImageUpload', {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 5 * 3024 * 3024,
});

Slingshot.createDirective('bookImageUpload', Slingshot.S3Storage, {
  AWSAccessKeyId: s3Settings.AWSAccessKeyId,
  AWSSecretAccessKey: s3Settings.AWSSecretAccessKey,
  bucket: s3Settings.AWSBucketName,
  acl: 'public-read',
  region: s3Settings.AWSRegion,

  authorize: function () {
    if (!this.userId) {
      var message = 'Please login before posting images';
      throw new Meteor.Error('Login Required', message);
    }
    return true;
  },

  key: function (file) {
    var currentUser = Meteor.user();
    return currentUser.username + '/' + file.name;
  },
});

Meteor.methods({
  registerUser: (user) => {
    Accounts.createUser({
      email: user.email,
      username: user.username,
      password: user.password,
    });
  },

  updateProfile: (values, languages) => {
    const currentUser = Meteor.user();

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          firstName: values.firstName,
          lastName: values.lastName,
          bio: values.bio,
          languages: languages,
        },
      });
    } catch (error) {
      return error;
    }
  },

  getMyBooks: () => {
    const currentUserId = Meteor.userId();
    try {
      const myBooks = Books.find({ ownerId: currentUserId }).fetch();
      return myBooks;
    } catch (error) {
      return error;
    }
  },

  getMyBook: (bookId) => {
    const currentUserId = Meteor.userId();

    try {
      return Books.findOne({
        _id: bookId,
        ownerId: currentUserId,
      });
    } catch (error) {
      return error;
    }
  },

  getABook: (bookId) => {
    try {
      return Books.findOne({
        _id: bookId,
      });
    } catch (error) {
      return error;
    }
  },

  getDiscoverBooks: () => {
    const currentUserId = Meteor.userId();

    try {
      if (currentUserId) {
        return Books.find(
          {
            ownerId: { $ne: currentUserId },
          },
          { limit: 50 },
        ).fetch();
      } else {
        return Books.find({}, { limit: 50 }).fetch();
      }
    } catch (error) {
      return error;
    }
  },

  insertBook: (book) => {
    const user = Meteor.user();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const bookExists = Books.findOne({
      title: book.title,
      ownerId: currentUserId,
    });

    if (bookExists) {
      throw new Meteor.Error(
        'You have already added a book with same title',
      );
    }

    let imageUrl =
      book.imageLinks &&
      (book.imageLinks.thumbnail || book.imageLinks.smallThumbnail);

    if (imageUrl && imageUrl.substring(0, 5) === 'http:') {
      imageUrl = imageUrl.slice(0, 4) + 's' + imageUrl.slice(4);
    }

    const newBook = {
      ...book,
      category: book.categories ? book.categories[0] : '',
      titleLowerCase: book.title && book.title.toLowerCase(),
      authorsLowerCase:
        book.authors &&
        book.authors.length > 0 &&
        book.authors.map((author) => author.toLowerCase()),
      ISBN:
        book.industryIdentifiers &&
        book.industryIdentifiers[0].identifier,
      imageUrl,
      ownerId: currentUserId,
      ownerUsername: user.username,
      ownerAvatar: user.avatar,
      xTimes: 0,
      isAvailable: true,
      dateAdded: new Date(),
    };

    const bookId = Books.insert(newBook, function (error, result) {
      if (error) {
        console.log('error!', error);
        throw new Meteor.error(error);
      } else {
        return bookId;
      }
    });
  },

  insertBookManually: (book) => {
    const user = Meteor.user();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;
    const bookExists = Books.findOne({
      title: book.title,
      ownerId: currentUserId,
    });

    if (bookExists) {
      throw new Meteor.Error(
        'You have already added a book with same title',
      );
    }

    const newBook = {
      ...book,
      ownerId: currentUserId,
      ownerUsername: user.username,
      ownerAvatar: user.avatar,
      xTimes: 0,
      isAvailable: true,
      dateAdded: new Date(),
    };

    const bookId = Books.insert(newBook, function (error, result) {
      if (error) {
        console.log('error!', error);
        throw new Meteor.error(error);
      } else {
        return bookId;
      }
    });
  },

  updateBook: (bookId, values) => {
    if (!Meteor.userId()) {
      return;
    }
    const theBook = Books.findOne(bookId);
    if (theBook.ownerId !== Meteor.userId()) {
      return;
    }
    try {
      Books.update(
        { _id: bookId },
        {
          $set: {
            title: values.title,
            authors: values.author,
            language: values.b_lang,
            description: values.description,
          },
        },
      );
    } catch (error) {
      return error;
    }
  },

  removeBook: (bookId) => {
    if (!Meteor.userId()) {
      return;
    }
    const theBook = Books.findOne(bookId);
    if (theBook.ownerId !== Meteor.userId()) {
      return;
    }

    try {
      Books.remove({ _id: bookId });
    } catch (error) {
      return error;
    }
  },

  getRequests: () => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) {
      return;
    }

    try {
      return Requests.find({
        $or: [
          { requesterId: currentUserId },
          { ownerId: currentUserId },
        ],
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
      return Requests.findOne({
        _id: requestId,
        $or: [
          { requesterId: currentUserId },
          { ownerId: currentUserId },
        ],
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
      const theBook = Books.findOne(bookId);
      const currentUser = Meteor.user();
      const owner = Meteor.users.findOne(theBook.ownerId);

      if (
        Requests.findOne({
          bookId: bookId,
          requesterId: currentUserId,
        })
      ) {
        throw new Meteor.Error(
          'You have already requested this item',
        );
      }
      const requestId = Requests.insert({
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

      Messages.insert({
        requestId: requestId,
        borrowerId: currentUserId,
        lenderId: theBook.ownerId,
        isSeenByOther: false,
        messages: new Array(),
      });

      Books.update(bookId, {
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
      throw new Meteor.Error('You are not logged in!');
    }

    const request = Requests.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    try {
      Requests.update(
        { _id: requestId },
        {
          $set: {
            isConfirmed: new Date(),
            isRepliedAndNotSeen: true,
          },
        },
      );

      Books.update(
        { _id: bookId },
        {
          $set: {
            onRequest: false,
            onAcceptance: true,
          },
        },
      );
    } catch (error) {
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

    const request = Requests.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    Requests.update(
      { _id: requestId },
      {
        $set: {
          isDenied: new Date(),
        },
      },
    );

    Books.update(
      { _id: request.bookId },
      {
        $set: {
          onRequest: false,
          isAvailable: true,
        },
      },
    );
  },

  isHanded: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }

    const request = Requests.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    Requests.update(
      { _id: requestId },
      {
        $set: {
          isHanded: new Date(),
        },
      },
    );

    Books.update(
      { _id: request.bookId },
      {
        $set: {
          onAcceptance: false,
          onLend: true,
        },
      },
    );
  },

  isReturned: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }

    const request = Requests.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    Requests.update(
      { _id: requestId },
      {
        $set: {
          isReturned: new Date(),
        },
      },
    );

    Books.update(
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
      },
    );
  },

  abortRequest: (requestId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }

    const request = Requests.findOne(requestId);
    if (request.ownerId !== currentUserId) {
      throw new Meteor.Error('You are not the owner!');
    }

    Requests.update(
      { _id: requestId },
      {
        $set: {
          isAborted: true,
        },
      },
    );

    Books.update(
      { _id: request.bookId },
      {
        $set: {
          isAvailable: true,
        },
      },
    );
  },

  addMessage: (requestId, message) => {
    const currentUserId = Meteor.userId();
    currentUser = Meteor.user();
    if (!currentUserId) {
      throw new Meteor.Error('You are not logged in');
    }
    const theMessage = Messages.findOne({
      requestId,
    });
    if (
      currentUserId !== theMessage.lenderId &&
      currentUserId !== theMessage.borrowerId
    ) {
      return;
    }
    try {
      const theMessage = Messages.findOne({ requestId });
      Messages.update(
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
        },
      );

      const unSeenIndex = theMessage.messages.length;
      Meteor.call(
        'createNotification',
        'request',
        requestId,
        unSeenIndex,
      );
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }

    // let othersId;
    // const theRequest = Requests.findOne(requestId);
    // if (theRequest.ownerUsername === currentUser.username) {
    //   othersId = theRequest.requesterId;
    // } else {
    //   othersId = theRequest.ownerId;
    // }

    // if (
    //   Messages.findOne({
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

  createNotification(contextName, contextId, unSeenIndex) {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }
    try {
      if (contextName !== 'request') {
        return;
      }
      const theRequest = Requests.findOne(contextId);
      const theOthersId =
        theRequest.requesterId === currentUser._id
          ? theRequest.ownerId
          : theRequest.requesterId;
      const theOther = Meteor.users.findOne(theOthersId);

      const contextIdIndex =
        theOther.notifications &&
        theOther.notifications.findIndex(
          (notification) => notification.contextId === contextId,
        );

      if (contextIdIndex !== -1) {
        const notifications = [...theOther.notifications];
        notifications[contextIdIndex].count += 1;
        if (!notifications[contextIdIndex].unSeenIndexes) {
          return;
        }
        notifications[contextIdIndex].unSeenIndexes.push(unSeenIndex);
        Meteor.users.update(theOther._id, {
          $set: {
            notifications: notifications,
          },
        });
      } else {
        Meteor.users.update(theOther._id, {
          $push: {
            notifications: {
              title: theOther.username,
              count: 1,
              context: contextName,
              contextId: contextId,
              unSeenIndexes: [unSeenIndex],
            },
          },
        });
      }
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  removeNotification(contextName, contextId, messageIndex) {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      const notifications = [...currentUser.notifications];
      if (!notifications) {
        return;
      }

      const notificationIndex = notifications.findIndex(
        (notification) => notification.contextId === contextId,
      );

      if (notificationIndex < 0) {
        return;
      }

      let onlyOneCount = false;
      if (notifications[notificationIndex].count === 1) {
        onlyOneCount = true;
      }

      if (onlyOneCount) {
        notifications.filter(
          (notification) => notification.contextId !== contextId,
        );
      } else {
        notifications[notificationIndex].count -= 1;
        notifications[notificationIndex].unSeenIndexes.filter(
          (unSeenIndex) => unSeenIndex !== messageIndex,
        );
      }

      Meteor.users.update(currentUser._id, {
        $set: {
          notifications: notifications,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setNewCoverImages(newImageSet) {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          coverImages: newImageSet,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setNewAvatar(newAvatar) {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          avatar: newAvatar,
          previousAvatar: currentUser.avatar,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setAvatarEmpty() {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          avatar: null,
          previousAvatar: currentUser.avatar,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setGeoLocationCoords(coords) {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          geoLocationCoords: coords,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  setIntroDone() {
    const currentUser = Meteor.user();
    if (!currentUser) {
      throw new Meteor.Error('Not allowed!');
    }

    try {
      Meteor.users.update(currentUser._id, {
        $set: {
          isIntroDone: true,
        },
      });
    } catch (error) {
      console.log('error', error);
      throw new Meteor.Error(error);
    }
  },

  isUsernameTaken(username) {
    const user = Accounts.findUserByUsername(username);
    return Boolean(user);
  },

  isEmailRegistered(email) {
    const user = Accounts.findUserByEmail(email);
    return Boolean(user);
  },
});

// PUBLICATIONS

// USER
Meteor.publish('me', function () {
  const userId = this.userId;
  if (userId) {
    return Meteor.users.find(userId);
  }
});

// BOOKS
Meteor.publish('myBooks', function () {
  const currentUserId = this.userId;
  return Books.find({
    ownerId: currentUserId,
  });
});

Meteor.publish('othersBooks', function () {
  const currentUserId = this.userId;
  if (currentUserId) {
    return Books.find(
      {
        ownerId: { $ne: currentUserId },
      },
      { limit: 20 },
    );
  } else {
    return Books.find({}, { limit: 20 });
  }
});

Meteor.publish('singleBook', function (bookId) {
  return Books.find({
    _id: bookId,
  });
});

// REQUESTS
Meteor.publish('myRequests', function () {
  var currentUserId = this.userId;
  return Requests.find({
    $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
  });
});

Meteor.publish('singleRequest', function (requestId) {
  var currentUserId = this.userId;
  return Requests.find({
    _id: requestId,
    $or: [{ requesterId: currentUserId }, { ownerId: currentUserId }],
  });
});

Meteor.publish('myMessages', function (requestId) {
  var currentUserId = this.userId;
  return Messages.find({
    requestId: requestId,
    $or: [{ borrowerId: currentUserId }, { lenderId: currentUserId }],
  });
});

Meteor.startup(function () {
  const smtp = Meteor.settings.mailCredentials.smtp;

  process.env.MAIL_URL =
    'smtps://' +
    encodeURIComponent(smtp.userName) +
    ':' +
    smtp.password +
    '@' +
    smtp.host +
    ':' +
    smtp.port;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    url = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${url}`;
  };
});

// getWelcomeEmailText = username => {
//   return `Hi ${username},\n\nWe are delighted to have you at Skogen.\nBy being a subscriber, you can easily take part in our public events and groups.\n\nRegards,\nSkogen Team`;
// };

Accounts.onCreateUser((options, user) => {
  user.languages = [];
  user.notifications = [];
  user.following = [];
  user.followedBy = [];
  user.coverImages = [];
  user.avatar = null;
  user.firstName = '';
  user.lastName = '';
  user.bio = '';

  // Meteor.call(
  //   'sendEmail',
  //   user.emails[0].address,
  //   'Welcome to Skogen',
  //   getWelcomeEmailText(user.username),
  //   true // is new user
  // );
  return user;
});
