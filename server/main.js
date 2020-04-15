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
      return Books.find({ added_by: currentUserId }).fetch();
    } catch (error) {
      return error;
    }
  },

  getMyBook: (bookId) => {
    const currentUserId = Meteor.userId();

    try {
      return Books.find({
        _id: bookId,
        added_by: currentUserId,
      });
    } catch (error) {
      return error;
    }
  },

  getABook: (bookId) => {
    try {
      return Books.find({
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
            added_by: { $ne: currentUserId },
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

  insertBook: (theBook) => {
    const user = Meteor.user();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;

    // const bookExists = Books.findOne({
    //   b_title_lowercase: theBook.b_title_lowercase,
    //   added_by: currentUserId,
    // });

    // if (bookExists) {
    //   throw new Meteor.Error('You have already added a book with same title');
    // }

    let image_url =
      theBook.imageLinks && theBook.imageLinks.thumbnail;

    if (image_url && image_url.substring(0, 5) === 'http:') {
      image_url = image_url.slice(0, 4) + 's' + image_url.slice(4);
    }

    const book = { ...theBook };

    const myBook = {
      date_added: new Date(),
      b_title: theBook.title,
      b_title_lowercase: theBook.title.toLowerCase(),
      b_author: theBook.authors && theBook.authors[0],
      b_author_lowercase:
        theBook.authors && theBook.authors[0].toLowerCase(),
      b_lang: theBook.language || '',
      image_url: image_url,
      b_cat: (theBook.categories && theBook.categories[0]) || '',
      b_ISBN:
        theBook.industryIdentifiers && theBook.industryIdentifiers[0],
      selfLinkGoogle: theBook.selfLink,
      added_by: currentUserId,
      owner_name: user.username,
      // owner_profile_image_url: user.profile.image_url,
      x_times: 0,
      is_available: true,
      ...theBook,
    };

    const bookId = Books.insert(myBook, function (error, result) {
      if (error) {
        console.log(error, 'error!');
      } else {
        return bookId;
      }
    });
  },

  updateBook: (bookId, values) => {
    if (!Meteor.userId()) {
      return false;
    }
    const theBook = Books.findOne(bookId);
    if (theBook.added_by !== Meteor.userId()) {
      return;
    }
    try {
      Books.update(
        { _id: bookId },
        {
          $set: {
            b_title: values.title,
            b_author: values.author,
            b_lang: values.b_lang,
            'b_ISBN.identifier': values.isbn,
            b_description: values.description,
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
    if (theBook.added_by !== Meteor.userId()) {
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
      return false;
    }

    try {
      return Requests.find({
        $or: [{ req_by: currentUserId }, { req_from: currentUserId }],
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
        _id: reqId,
        $or: [{ req_by: currentUserId }, { req_from: currentUserId }],
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
      const owner = Meteor.users.findOne(theBook.added_by);

      if (
        Requests.findOne({ req_b_id: bookId, req_by: currentUserId })
      ) {
        throw new Meteor.Error(
          'You have already requested this item',
        );
      }

      const reqId = Requests.insert({
        req_b_id: bookId,
        req_by: currentUserId,
        req_from: theBook.added_by,
        book_name: theBook.b_title,
        book_author: theBook.b_author,
        owner_name: theBook.owner_name,
        requester_name: currentUser.username,
        book_image_url: theBook.image_url || '',
        owner_profile_image:
          (owner.profile && owner.profile.image_url) || '',
        requester_profile_image:
          (currentUser.profile && currentUser.profile.image_url) ||
          '',
        date_requested: new Date(),
      });

      Messages.insert({
        req_id: reqId,
        borrower_id: currentUserId,
        lender_id: theBook.added_by,
        is_seen_by_other: false,
        messages: new Array(),
      });

      Books.update(bookId, {
        $set: {
          on_request: true,
          is_available: false,
        },
      });

      return reqId;

      // const subjectEmail = 'Someone is interested in reading your book';
      // var textEmail =
      //   'Hi ' +
      //   ownerName +
      //   '. ' +
      //   requesterName +
      //   ' has requested to borrow a book from you. Please go ahead and reply at: https://app.pomegra.org/my-requests/';
      // Meteor.call('sendEmail', ownerId, subjectEmail, textEmail);
    } catch (error) {
      return error;
    }
  },

  acceptRequest: (reqId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      return false;
    }

    const req = Requests.findOne(reqId);
    if (req.req_from !== currentUserId) {
      return false;
    }

    try {
      Requests.update(
        { _id: reqId },
        {
          $set: {
            is_confirmed: new Date(),
            is_replied_and_not_seen: true,
          },
        },
      );

      Books.update(
        { _id: bookId },
        {
          $set: {
            on_request: false,
            on_acceptance: true,
          },
        },
      );
      return;
    } catch (error) {
      return error;
    }

    const subjectEmail = 'Your request has been accepted!';
    const textEmail = `Congratulations! One of your requests has been accepted. Check at: https://app.pomegra.org/request/${reqId}`;
    Meteor.call('sendEmail', borrowerId, subjectEmail, textEmail);
  },

  denyRequest: (reqId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      return false;
    }

    const request = Requests.findOne(reqId);
    if (request.req_from !== currentUserId) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_denied: new Date(),
        },
      },
    );

    Books.update(
      { _id: request.req_b_id },
      {
        $set: {
          on_request: false,
          is_available: true,
        },
      },
    );
  },

  isHanded: (reqId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      return false;
    }

    const request = Requests.findOne(reqId);
    if (request.req_from !== currentUserId) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_handed: new Date(),
        },
      },
    );

    Books.update(
      { _id: request.req_b_id },
      {
        $set: {
          on_acceptance: false,
          on_lend: true,
        },
      },
    );
  },

  isReturned: (reqId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      return false;
    }

    const request = Requests.findOne(reqId);
    if (request.req_from !== currentUserId) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_returned: new Date(),
        },
      },
    );

    Books.update(
      { _id: request.req_b_id },
      {
        $set: {
          on_lend: false,
          returned: true,
          is_available: true,
        },
        $inc: {
          x_times: 1,
        },
      },
    );
  },

  abortRequest: (reqId) => {
    const currentUserId = Meteor.userId();

    if (!currentUserId) {
      return false;
    }

    const request = Requests.findOne(reqId);
    if (request.req_from !== currentUserId) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_archived: true,
          is_aborted: true,
        },
      },
    );

    Books.update(
      { _id: request.req_b_id },
      {
        $set: {
          is_available: true,
        },
      },
    );
  },

  addMessage: (requestId, message) => {
    const currentUserId = Meteor.userId();
    currentUser = Meteor.user();
    if (!currentUserId) {
      return false;
    }
    const theMessage = Messages.findOne({
      req_id: requestId,
    });
    if (
      currentUserId !== theMessage.lender_id &&
      currentUserId !== theMessage.borrower_id
    ) {
      return;
    }
    try {
      const Message = Messages.findOne({ req_id: requestId });
      Messages.update(
        { req_id: requestId },
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
            is_seen_by_other: false,
            last_msg_by: currentUserId,
          },
        },
      );

      const unSeenIndex = Message.messages.length;
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
    // if (theRequest.owner_name === currentUser.username) {
    //   othersId = theRequest.req_by;
    // } else {
    //   othersId = theRequest.req_from;
    // }

    // if (
    //   Messages.findOne({
    //     is_seen_by_other: false,
    //     req_id: requestId
    //   })
    // ) {
    // const myName = Meteor.user().username;
    // const subjectEmail = 'You have a new message!';
    // const textEmail = `You received a new message from ${myName}. You can see and reply here: https://app.pomegra.org/request/${requestId}`;
    // Meteor.call('sendEmail', othersId, subjectEmail, textEmail);
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
        theRequest.req_by === currentUser._id
          ? theRequest.req_from
          : theRequest.req_by;
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
    added_by: currentUserId,
  });
});

Meteor.publish('othersBooks', function () {
  const currentUserId = this.userId;
  if (currentUserId) {
    return Books.find(
      {
        added_by: { $ne: currentUserId },
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
    $or: [{ req_by: currentUserId }, { req_from: currentUserId }],
  });
});

Meteor.publish('singleRequest', function (reqId) {
  var currentUserId = this.userId;
  return Requests.find({
    _id: reqId,
    $or: [{ req_by: currentUserId }, { req_from: currentUserId }],
  });
});

Meteor.publish('myMessages', function (reqId) {
  var currentUserId = this.userId;
  return Messages.find({
    req_id: reqId,
    $or: [
      { borrower_id: currentUserId },
      { lender_id: currentUserId },
    ],
  });
});

Meteor.startup(function () {
  console.log('Meteor successfully started');
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
