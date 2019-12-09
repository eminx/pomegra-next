import { Meteor } from 'meteor/meteor';
import { Books } from '/imports/api/collections';
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
    console.log(theBook);
    const user = Meteor.user();
    if (!user) {
      return false;
    }
    const currentUserId = user._id;

    const myBook = {
      date_added: new Date(),
      b_title: theBook.title,
      b_title_lowercase: theBook.title.toLowerCase(),
      b_author: theBook.authors[0],
      b_author_lowercase: theBook.authors[0].toLowerCase(),
      b_lang: theBook.language || '',
      image_url: theBook.imageLinks && theBook.imageLinks.thumbnail,
      b_cat: (theBook.categories && theBook.categories[0]) || '',
      b_ISBN: theBook.industryIdentifiers[0],
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
});
