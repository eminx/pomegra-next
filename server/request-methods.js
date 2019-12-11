import { Meteor } from 'meteor/meteor';
import { Books, Requests, Messages } from '/imports/api/collections';

Meteor.methods({
  makeRequest: (bookId, ownerId, bName, bAuthor, ownerName, bookImage) => {
    if (!Meteor.userId()) {
      return false;
    }

    try {
      var currentUserId = Meteor.userId();
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
          owner_profile_image: owner.profile.image_url,
          requester_profile_image: currentUser.profile.image_url,
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
        var textEmail =
          'Hi ' +
          ownerName +
          '. ' +
          requesterName +
          ' has requested to borrow a book from you. Please go ahead and reply at: https://app.pomegra.org/my-requests/';
        Meteor.call('sendEmail', ownerId, subjectEmail, textEmail);
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
