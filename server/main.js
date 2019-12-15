import { Meteor } from 'meteor/meteor';
import { Books, Requests, Messages } from '/imports/api/collections';
import { Accounts } from 'meteor/accounts-base';

function insertLink(title, url) {
  Books.insert({ title, url, createdAt: new Date() });
}

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  if (Books.find().count() === 0) {
    insertLink(
      'Do the Tutorial',
      'https://www.meteor.com/tutorials/react/creating-an-app'
    );

    insertLink('Follow the Guide', 'http://guide.meteor.com');

    insertLink('Read the Docs', 'https://docs.meteor.com');

    insertLink('Discussions', 'https://forums.meteor.com');
  }
});

Meteor.methods({
  registerUser(user) {
    Accounts.createUser({
      email: user.email,
      username: user.username,
      password: user.password,
    });
  },

  insertBook: theBook => {
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

    const myBook = {
      date_added: new Date(),
      b_title: theBook.title,
      b_title_lowercase: theBook.title.toLowerCase(),
      b_author: theBook.authors && theBook.authors[0],
      b_author_lowercase: theBook.authors && theBook.authors[0].toLowerCase(),
      b_lang: theBook.language || '',
      image_url: theBook.imageLinks && theBook.imageLinks.thumbnail,
      b_cat: (theBook.categories && theBook.categories[0]) || '',
      b_ISBN: theBook.industryIdentifiers && theBook.industryIdentifiers[0],
      selfLinkGoogle: theBook.selfLink,
      added_by: currentUserId,
      owner_name: user.username,
      // owner_profile_image_url: user.profile.image_url,
      x_times: 0,
      is_available: 1,
    };

    const bookId = Books.insert(myBook, function(error, result) {
      if (error) {
        console.log(error, 'error!');
      } else {
        return bookId;
      }
    });
  },

  makeRequest: (bookId, ownerId, bName, bAuthor, ownerName, bookImage) => {
    if (!Meteor.userId()) {
      return false;
    }

    try {
      const currentUserId = Meteor.userId();
      if (Requests.findOne({ req_b_id: bookId, req_by: currentUserId })) {
        throw new Meteor.Error('You have already requested this item');
      } else {
        const currentUser = Meteor.user();
        const owner = Meteor.users.findOne({ username: ownerName });
        const reqId = Requests.insert({
          req_b_id: bookId,
          req_by: currentUserId,
          book_image_url: bookImage,
          req_from: ownerId,
          book_name: bName,
          book_author: bAuthor,
          owner_name: ownerName,
          requester_name: currentUser.username,
          // owner_profile_image: owner.profile.image_url,
          // requester_profile_image: currentUser.profile.image_url,
          date_requested: new Date(),
        });

        Messages.insert({
          req_id: reqId,
          borrower_id: currentUserId,
          lender_id: ownerId,
          is_seen_by_other: 0,
          messages: new Array(),
        });

        Books.update(bookId, {
          $set: {
            on_request: 1,
            is_available: 0,
          },
        });

        var subjectEmail = 'Someone is interested in reading your book';

        return reqId;

        var textEmail =
          'Hi ' +
          ownerName +
          '. ' +
          requesterName +
          ' has requested to borrow a book from you. Please go ahead and reply at: https://app.pomegra.org/my-requests/';
        Meteor.call('sendEmail', ownerId, subjectEmail, textEmail);
        return 'success';
      }
    } catch (e) {
      return e;
    }
  },

  reqAccept: (reqId, bookId, borrowerId) => {
    if (Meteor.userId() !== Books.findOne(bookId).added_by) {
      return false;
    }

    var currentUserId = Meteor.userId();
    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_confirmed: new Date(),
          is_replied_and_not_seen: 1,
        },
      }
    );

    Books.update(
      { _id: bookId },
      {
        $set: {
          on_request: 0,
          on_acceptance: 1,
        },
      }
    );
    const subjectEmail = 'Your request has been accepted!';
    const textEmail = `Congratulations! One of your requests has been accepted. Check at: https://app.pomegra.org/request/${reqId}`;

    Meteor.call('sendEmail', borrowerId, subjectEmail, textEmail);
  },

  denyRequest: (bookId, reqId) => {
    if (!Meteor.userId()) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_denied: new Date(),
        },
      }
    );

    Books.update(
      { _id: bookId },
      {
        $set: {
          on_request: 0,
          is_available: 1,
        },
      }
    );
  },

  isHanded: (reqId, bookId) => {
    if (!Meteor.userId()) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_handed: new Date(),
        },
      }
    );

    Books.update(
      { _id: bookId },
      {
        $set: {
          on_acceptance: 0,
          on_lend: 1,
        },
      }
    );
  },

  isReturned: function(reqId, bookId) {
    if (!Meteor.userId()) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_returned: new Date(),
        },
      }
    );

    Books.update(
      { _id: bookId },
      {
        $set: {
          on_lend: 0,
          returned: 1,
          is_available: 1,
        },
        $inc: {
          x_times: 1,
        },
      }
    );
  },

  abortRequest: function(reqId, bookId) {
    if (!Meteor.userId()) {
      return false;
    }

    Requests.update(
      { _id: reqId },
      {
        $set: {
          is_archived: true,
          is_aborted: true,
        },
      }
    );

    Books.update(
      { _id: bookId },
      {
        $set: {
          is_available: 1,
        },
      }
    );
  },
});
